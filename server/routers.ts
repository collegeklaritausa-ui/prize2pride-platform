import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { proficiencyLevels, lessonCategories } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  
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
        level: z.enum(proficiencyLevels).optional(),
        category: z.enum(lessonCategories).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllLessons(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lesson = await db.getLessonById(input.id);
        if (!lesson) return null;
        
        const content = await db.getLessonContent(input.id);
        const exercises = await db.getLessonExercises(input.id);
        
        return { lesson, content, exercises };
      }),

    getRecommended: protectedProcedure
      .input(z.object({ limit: z.number().default(5) }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getRecommendedLessons(ctx.user.id, input?.limit || 5);
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
        return await db.getAllVocabulary(input?.level);
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

      // Seed avatars
      const sampleAvatars = [
        { id: "emma", name: "Emma", personality: "Friendly and patient American English teacher from California. Uses casual, encouraging language.", specialty: "Daily Conversation" },
        { id: "james", name: "James", personality: "Professional business consultant from New York. Formal yet approachable communication style.", specialty: "Business English" },
        { id: "sophia", name: "Sophia", personality: "Enthusiastic travel blogger who loves sharing stories. Uses vivid descriptions and travel vocabulary.", specialty: "Travel English" },
        { id: "michael", name: "Michael", personality: "Academic professor with expertise in clear explanations. Patient and thorough in teaching.", specialty: "Academic English" },
      ];

      for (const avatar of sampleAvatars) {
        await db.createAvatar(avatar);
      }

      // Seed achievements
      const sampleAchievements = [
        { name: "First Steps", description: "Complete your first lesson", xpReward: 50, requirement: JSON.stringify({ type: "lessons_completed", count: 1 }), category: "lessons" as const },
        { name: "Dedicated Learner", description: "Complete 10 lessons", xpReward: 200, requirement: JSON.stringify({ type: "lessons_completed", count: 10 }), category: "lessons" as const },
        { name: "Vocabulary Builder", description: "Add 50 words to your flashcard collection", xpReward: 100, requirement: JSON.stringify({ type: "vocabulary_added", count: 50 }), category: "vocabulary" as const },
        { name: "Week Warrior", description: "Maintain a 7-day learning streak", xpReward: 150, requirement: JSON.stringify({ type: "streak", count: 7 }), category: "streak" as const },
        { name: "Level Up", description: "Reach level 5", xpReward: 250, requirement: JSON.stringify({ type: "level", count: 5 }), category: "level" as const },
      ];

      for (const achievement of sampleAchievements) {
        await db.createAchievement(achievement);
      }

      return { success: true, message: "Sample data seeded successfully" };
    }),
  }),
});

export type AppRouter = typeof appRouter;
