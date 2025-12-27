import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { generateSpeech, generatePronunciation, generateAvatarSpeech } from "./_core/textToSpeech";
import { executeAmos } from "./_core/amosOrchestrator";
import { generateAvatarImage, generateEducationalImage, generateVocabularyImage, generateScenarioImage, avatarTemplates } from "./_core/aiImageGenerator";
import { createCertificateData, generateCertificate } from "./_core/certificateGenerator";
import { createDailyGoal, updateDailyGoalProgress, calculateGoalProgress, generateWeeklyReport } from "./_core/progressTracking";
import { createAchievementShare, createStreakShare, createCertificateShare, generateShareLinks } from "./_core/socialSharing";
import { proficiencyLevels, lessonCategories } from "../drizzle/schema";
import { subscriptionRouter } from "./routers/subscription";
import { getAllLessonsFromFiles, getLessonByIdFromFiles } from "./lessonFileLoader";

export const appRouter = router({
  system: systemRouter,
  subscription: subscriptionRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // User profile and stats
  user: router({
    getStats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserStats(ctx.user.id);
    }),

    updatePreferredLevel: protectedProcedure
      .input(z.object({ level: z.enum(proficiencyLevels) }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserPreferredLevel(ctx.user.id, input.level);
        return { success: true };
      }),

    updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
      const newStreak = await db.updateUserStreak(ctx.user.id);
      return { streak: newStreak };
    }),
  }),

  // Lessons
  lessons: router({
    list: publicProcedure
      .input(z.object({
        level: z.string().optional(),
        category: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        // Try database first
        const dbLessons = await db.getAllLessons(input as any);
        if (dbLessons && dbLessons.length > 0) return dbLessons;
        
        // Fallback to file loader for direct publishing
        return await getAllLessonsFromFiles(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        // Try database first
        const [lesson, content, exercises] = await Promise.all([
          db.getLessonById(input.id),
          db.getLessonContent(input.id),
          db.getLessonExercises(input.id),
        ]);

        if (lesson) return { lesson, content, exercises };
        
        // Fallback to file loader
        const fileLesson = await getLessonByIdFromFiles(input.id);
        if (!fileLesson) return null;
        
        return {
          lesson: {
            id: fileLesson.id,
            title: fileLesson.title,
            description: fileLesson.description,
            level: fileLesson.level,
            category: fileLesson.category,
            duration: fileLesson.duration,
            xpReward: fileLesson.xpReward,
            avatarId: fileLesson.avatarId,
            isPublished: true
          },
          content: {
            content: fileLesson.content,
            objectives: fileLesson.objectives,
            culturalNotes: fileLesson.culturalNotes
          },
          exercises: fileLesson.exercises,
          vocabulary: fileLesson.vocabulary
        };
      }),

    getRecommended: protectedProcedure
      .input(z.object({ limit: z.number().default(5) }).optional())
      .query(async ({ ctx, input }) => {
        const dbRecommended = await db.getRecommendedLessons(ctx.user.id, input?.limit || 5);
        if (dbRecommended && dbRecommended.length > 0) return dbRecommended;
        
        // Fallback to file loader
        const allLessons = await getAllLessonsFromFiles();
        return allLessons.slice(0, input?.limit || 5);
      }),

    // Admin: Create lesson
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        level: z.enum(proficiencyLevels),
        category: z.enum(lessonCategories),
        duration: z.number().optional(),
        xpReward: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const lessonId = await db.createLesson(input);
        return { lessonId };
      }),
  }),

  // Progress tracking
  progress: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAllUserProgress(ctx.user.id);
    }),

    getForLesson: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserLessonProgress(ctx.user.id, input.lessonId);
      }),

    update: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        status: z.enum(['not_started', 'in_progress', 'completed']),
        progress: z.number().min(0).max(100),
        score: z.number().optional(),
        xpEarned: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertUserLessonProgress({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          status: input.status,
          progress: input.progress,
          score: input.score,
          xpEarned: input.xpEarned || 0,
          completedAt: input.status === 'completed' ? new Date() : undefined,
        });

        // Update XP if lesson completed
        if (input.status === 'completed' && input.xpEarned) {
          await db.updateUserXp(ctx.user.id, input.xpEarned);
        }

        // Update streak
        await db.updateUserStreak(ctx.user.id);

        return { success: true };
      }),
  }),

  // Exercises
  exercises: router({
    submit: protectedProcedure
      .input(z.object({
        exerciseId: z.number(),
        answer: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get exercise to check answer
        const exerciseData = await db.getLessonExercises(0); // We need to get by ID
        // For now, record the attempt
        const isCorrect = true; // This would be validated against correctAnswer
        const xpEarned = isCorrect ? 10 : 0;

        await db.recordExerciseAttempt({
          userId: ctx.user.id,
          exerciseId: input.exerciseId,
          userAnswer: input.answer,
          isCorrect,
          xpEarned,
        });

        if (isCorrect) {
          await db.updateUserXp(ctx.user.id, xpEarned);
        }

        return { isCorrect, xpEarned };
      }),
  }),

  // Vocabulary & Flashcards
  vocabulary: router({
    list: publicProcedure
      .input(z.object({ level: z.enum(proficiencyLevels).optional() }).optional())
      .query(async ({ input }) => {
        const dbVocab = await db.getAllVocabulary(input?.level);
        if (dbVocab && dbVocab.length > 0) return dbVocab;
        
        // Fallback to file loader
        const allLessons = await getAllLessonsFromFiles({ level: input?.level });
        const vocab = allLessons.flatMap(l => l.vocabulary || []);
        return vocab.slice(0, 50); // Limit for performance
      }),

    getUserVocabulary: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserVocabulary(ctx.user.id);
    }),

    getDueFlashcards: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getDueFlashcards(ctx.user.id, input?.limit || 20);
      }),

    addToCollection: protectedProcedure
      .input(z.object({ vocabularyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.addVocabularyToUser(ctx.user.id, input.vocabularyId);
        return { success: true };
      }),

    reviewFlashcard: protectedProcedure
      .input(z.object({
        vocabularyId: z.number(),
        quality: z.number().min(0).max(5), // SM-2 quality rating
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateFlashcardReview(ctx.user.id, input.vocabularyId, input.quality);
        
        // Award XP for reviewing
        if (input.quality >= 3) {
          await db.updateUserXp(ctx.user.id, 5);
        }
        
        return { success: true };
      }),
  }),

  // Achievements
  achievements: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAchievements();
    }),

    getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAchievements(ctx.user.id);
    }),
  }),

  // Avatars
  avatars: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAvatars();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getAvatarById(input.id);
      }),
  }),

  // AMOS - Autonomous Multimedia Orchestration System
  amos: router({
    orchestrate: publicProcedure
      .input(z.object({
        lessonId: z.string(),
        lessonTitle: z.string(),
        lessonContent: z.string(),
        avatarId: z.string(),
        avatarImagePath: z.string(),
        language: z.enum(['en', 'ar']),
        studioTheme: z.enum(['casino-gold', 'luxury-blue', 'emerald-garden', 'sunset-orange']),
      }))
      .mutation(async ({ input }) => {
        const output = await executeAmos(input);
        
        const themeConfigs: Record<string, any> = {
          'casino-gold': {
            backgroundColor: '#1a1a2e',
            accentColor: '#ffd700',
            brandColor: '#ffd700',
            textColor: '#ffffff',
            highlightColor: '#ffed4e'
          },
          'luxury-blue': {
            backgroundColor: '#0f1419',
            accentColor: '#1e90ff',
            brandColor: '#00d4ff',
            textColor: '#e0e0e0',
            highlightColor: '#00ffff'
          },
          'emerald-garden': {
            backgroundColor: '#0a1f12',
            accentColor: '#00d084',
            brandColor: '#00d084',
            textColor: '#e8f5e9',
            highlightColor: '#4ade80'
          },
          'sunset-orange': {
            backgroundColor: '#1a0f0a',
            accentColor: '#ff6b35',
            brandColor: '#ff8c42',
            textColor: '#ffe8d6',
            highlightColor: '#ffb84d'
          }
        };

        const theme = themeConfigs[input.studioTheme] || themeConfigs['casino-gold'];

        return {
          success: true,
          output,
          theme,
          message: `AMOS orchestration complete for lesson ${input.lessonId}`
        };
      }),
  }),

  // Conversation Practice with AI
  conversation: router({
    start: protectedProcedure
      .input(z.object({
        scenarioId: z.string(),
        avatarId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const sessionId = await db.createConversationSession({
          userId: ctx.user.id,
          scenarioId: input.scenarioId,
          avatarId: input.avatarId,
          messages: [],
        });
        return { sessionId };
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        message: z.string(),
        scenarioContext: z.string().optional(),
        avatarPersonality: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get AI response using LLM
        const systemPrompt = `You are an American English conversation partner helping someone practice English. 
${input.avatarPersonality ? `Your personality: ${input.avatarPersonality}` : ''}
${input.scenarioContext ? `Scenario: ${input.scenarioContext}` : ''}

Guidelines:
- Use natural, conversational American English
- Gently correct any grammar or vocabulary mistakes the user makes
- Keep responses concise but engaging
- Occasionally introduce new vocabulary or expressions
- Be encouraging and supportive`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.message },
          ],
        });

        const messageContent = response.choices[0]?.message?.content;
const aiResponse = typeof messageContent === 'string' ? messageContent : "I'm sorry, I didn't understand that. Could you try again?";

        return { 
          response: aiResponse,
          corrections: [], // Could parse corrections from AI response
        };
      }),

    end: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        messages: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        // Generate feedback using LLM
        const feedbackResponse = await invokeLLM({
          messages: [
            { 
              role: "system", 
              content: "You are an English teacher providing feedback on a conversation practice session. Analyze the conversation and provide: 1) Overall assessment, 2) Grammar points to improve, 3) Vocabulary suggestions, 4) A score out of 100." 
            },
            { 
              role: "user", 
              content: `Please analyze this conversation:\n${input.messages.map(m => `${m.role}: ${m.content}`).join('\n')}` 
            },
          ],
        });

        const feedbackContent = feedbackResponse.choices[0]?.message?.content;
        const feedback = typeof feedbackContent === 'string' ? feedbackContent : "Great practice session!";
        const score = 80; // Could parse from feedback
        const xpEarned = Math.floor(score / 2);

        await db.updateConversationSession(input.sessionId, {
          messages: input.messages,
          feedback,
          score,
          xpEarned,
          endedAt: new Date(),
        });

        await db.updateUserXp(ctx.user.id, xpEarned);

        return { feedback, score, xpEarned };
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserConversationSessions(ctx.user.id);
    }),
  }),

  // Seed data for development
  seed: router({
    seedLessons: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      // Seed sample lessons
      const sampleLessons = [
        { title: "Greetings & Introductions", description: "Learn how to introduce yourself and greet others in American English", level: "A1" as const, category: "daily_conversation" as const, duration: 15, xpReward: 50, order: 1 },
        { title: "At the Coffee Shop", description: "Order your favorite drinks and snacks like a native speaker", level: "A1" as const, category: "daily_conversation" as const, duration: 20, xpReward: 60, order: 2 },
        { title: "Making Small Talk", description: "Master the art of casual conversation", level: "A2" as const, category: "social" as const, duration: 25, xpReward: 70, order: 3 },
        { title: "Job Interview Basics", description: "Prepare for your first job interview in English", level: "B1" as const, category: "business" as const, duration: 30, xpReward: 100, order: 4 },
        { title: "Travel Essentials", description: "Navigate airports, hotels, and tourist spots with confidence", level: "A2" as const, category: "travel" as const, duration: 25, xpReward: 75, order: 5 },
        { title: "American Idioms 101", description: "Understand and use common American expressions", level: "B1" as const, category: "idioms" as const, duration: 20, xpReward: 80, order: 6 },
        { title: "Business Email Writing", description: "Write professional emails that get results", level: "B2" as const, category: "business" as const, duration: 35, xpReward: 120, order: 7 },
        { title: "Academic Presentations", description: "Present your ideas clearly in academic settings", level: "C1" as const, category: "academic" as const, duration: 40, xpReward: 150, order: 8 },
      ];

      for (const lesson of sampleLessons) {
        await db.createLesson(lesson);
      }

      // Seed sample vocabulary
      const sampleVocabulary = [
        { word: "awesome", definition: "Extremely good; excellent", pronunciation: "/ˈɔːsəm/", partOfSpeech: "adjective", exampleSentence: "That concert was awesome!", level: "A1" as const },
        { word: "hang out", definition: "To spend time relaxing or socializing", pronunciation: "/hæŋ aʊt/", partOfSpeech: "phrasal verb", exampleSentence: "Let's hang out this weekend.", level: "A2" as const },
        { word: "deadline", definition: "The latest time by which something must be completed", pronunciation: "/ˈdedlaɪn/", partOfSpeech: "noun", exampleSentence: "The project deadline is next Friday.", level: "B1" as const },
        { word: "brainstorm", definition: "To think of many ideas quickly", pronunciation: "/ˈbreɪnstɔːrm/", partOfSpeech: "verb", exampleSentence: "Let's brainstorm some solutions.", level: "B1" as const },
        { word: "networking", definition: "Building professional relationships", pronunciation: "/ˈnetwɜːrkɪŋ/", partOfSpeech: "noun", exampleSentence: "Networking is essential for career growth.", level: "B2" as const },
      ];

      for (const vocab of sampleVocabulary) {
        await db.createVocabulary(vocab);
      }

      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
