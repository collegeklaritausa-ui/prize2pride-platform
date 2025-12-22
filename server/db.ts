import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  lessons, InsertLesson, Lesson,
  lessonContent, InsertLessonContent,
  exercises, InsertExercise,
  userLessonProgress, InsertUserLessonProgress,
  userExerciseAttempts, InsertUserExerciseAttempt,
  vocabulary, InsertVocabulary,
  userVocabulary, InsertUserVocabulary,
  achievements, InsertAchievement,
  userAchievements, InsertUserAchievement,
  conversationSessions, InsertConversationSession,
  avatars, InsertAvatar,
  ProficiencyLevel, LessonCategory
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserXp(userId: number, xpToAdd: number) {
  const db = await getDb();
  if (!db) return;

  const user = await getUserById(userId);
  if (!user) return;

  const newXp = user.xp + xpToAdd;
  const newLevel = Math.floor(newXp / 500) + 1; // Level up every 500 XP

  await db.update(users)
    .set({ 
      xp: newXp, 
      level: newLevel,
      lastActivityDate: new Date()
    })
    .where(eq(users.id, userId));

  return { xp: newXp, level: newLevel };
}

export async function updateUserStreak(userId: number) {
  const db = await getDb();
  if (!db) return;

  const user = await getUserById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
  }

  let newStreak = user.streak;
  
  if (!lastActivity) {
    newStreak = 1;
  } else {
    const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak = user.streak + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  await db.update(users)
    .set({ streak: newStreak, lastActivityDate: new Date() })
    .where(eq(users.id, userId));

  return newStreak;
}

export async function updateUserPreferredLevel(userId: number, level: ProficiencyLevel) {
  const db = await getDb();
  if (!db) return;

  await db.update(users)
    .set({ preferredLevel: level })
    .where(eq(users.id, userId));
}

// ============ LESSON FUNCTIONS ============

export async function getAllLessons(filters?: { level?: ProficiencyLevel; category?: LessonCategory }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(lessons.isPublished, true)];
  
  if (filters?.level) {
    conditions.push(eq(lessons.level, filters.level));
  }
  if (filters?.category) {
    conditions.push(eq(lessons.category, filters.category));
  }

  return await db.select()
    .from(lessons)
    .where(and(...conditions))
    .orderBy(asc(lessons.order));
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLessonContent(lessonId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(lessonContent)
    .where(eq(lessonContent.lessonId, lessonId))
    .orderBy(asc(lessonContent.order));
}

export async function getLessonExercises(lessonId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(exercises)
    .where(eq(exercises.lessonId, lessonId))
    .orderBy(asc(exercises.order));
}

export async function createLesson(lesson: InsertLesson) {
  const db = await getDb();
  if (!db) return;

  const result = await db.insert(lessons).values(lesson);
  return result[0].insertId;
}

export async function createLessonContent(content: InsertLessonContent) {
  const db = await getDb();
  if (!db) return;

  await db.insert(lessonContent).values(content);
}

export async function createExercise(exercise: InsertExercise) {
  const db = await getDb();
  if (!db) return;

  await db.insert(exercises).values(exercise);
}

// ============ USER PROGRESS FUNCTIONS ============

export async function getUserLessonProgress(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(userLessonProgress)
    .where(and(
      eq(userLessonProgress.userId, userId),
      eq(userLessonProgress.lessonId, lessonId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(userLessonProgress)
    .where(eq(userLessonProgress.userId, userId))
    .orderBy(desc(userLessonProgress.lastAccessedAt));
}

export async function upsertUserLessonProgress(progress: InsertUserLessonProgress) {
  const db = await getDb();
  if (!db) return;

  const existing = await getUserLessonProgress(progress.userId, progress.lessonId);
  
  if (existing) {
    await db.update(userLessonProgress)
      .set({
        status: progress.status,
        progress: progress.progress,
        score: progress.score,
        xpEarned: progress.xpEarned,
        completedAt: progress.completedAt,
        lastAccessedAt: new Date()
      })
      .where(eq(userLessonProgress.id, existing.id));
  } else {
    await db.insert(userLessonProgress).values({
      ...progress,
      startedAt: new Date(),
      lastAccessedAt: new Date()
    });
  }
}

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const user = await getUserById(userId);
  if (!user) return null;

  const progressList = await getAllUserProgress(userId);
  const completedLessons = progressList.filter(p => p.status === 'completed').length;
  const totalXpFromLessons = progressList.reduce((sum, p) => sum + p.xpEarned, 0);

  const userAchievementsList = await getUserAchievements(userId);

  return {
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    completedLessons,
    totalXpFromLessons,
    achievementsCount: userAchievementsList.length,
    preferredLevel: user.preferredLevel
  };
}

// ============ EXERCISE ATTEMPT FUNCTIONS ============

export async function recordExerciseAttempt(attempt: InsertUserExerciseAttempt) {
  const db = await getDb();
  if (!db) return;

  await db.insert(userExerciseAttempts).values(attempt);
}

export async function getUserExerciseAttempts(userId: number, exerciseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(userExerciseAttempts)
    .where(and(
      eq(userExerciseAttempts.userId, userId),
      eq(userExerciseAttempts.exerciseId, exerciseId)
    ))
    .orderBy(desc(userExerciseAttempts.attemptedAt));
}

// ============ VOCABULARY FUNCTIONS ============

export async function getAllVocabulary(level?: ProficiencyLevel) {
  const db = await getDb();
  if (!db) return [];

  if (level) {
    return await db.select().from(vocabulary).where(eq(vocabulary.level, level));
  }
  return await db.select().from(vocabulary);
}

export async function getVocabularyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(vocabulary).where(eq(vocabulary.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createVocabulary(vocab: InsertVocabulary) {
  const db = await getDb();
  if (!db) return;

  await db.insert(vocabulary).values(vocab);
}

// ============ USER VOCABULARY (FLASHCARDS) FUNCTIONS ============

export async function getUserVocabulary(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    userVocab: userVocabulary,
    vocab: vocabulary
  })
    .from(userVocabulary)
    .innerJoin(vocabulary, eq(userVocabulary.vocabularyId, vocabulary.id))
    .where(eq(userVocabulary.userId, userId));
}

export async function getDueFlashcards(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  
  return await db.select({
    userVocab: userVocabulary,
    vocab: vocabulary
  })
    .from(userVocabulary)
    .innerJoin(vocabulary, eq(userVocabulary.vocabularyId, vocabulary.id))
    .where(and(
      eq(userVocabulary.userId, userId),
      lte(userVocabulary.nextReviewDate, now)
    ))
    .orderBy(asc(userVocabulary.nextReviewDate))
    .limit(limit);
}

export async function addVocabularyToUser(userId: number, vocabularyId: number) {
  const db = await getDb();
  if (!db) return;

  // Check if already exists
  const existing = await db.select()
    .from(userVocabulary)
    .where(and(
      eq(userVocabulary.userId, userId),
      eq(userVocabulary.vocabularyId, vocabularyId)
    ))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userVocabulary).values({
      userId,
      vocabularyId,
      nextReviewDate: new Date()
    });
  }
}

export async function updateFlashcardReview(
  userId: number, 
  vocabularyId: number, 
  quality: number // 0-5 rating (0=complete blackout, 5=perfect)
) {
  const db = await getDb();
  if (!db) return;

  const existing = await db.select()
    .from(userVocabulary)
    .where(and(
      eq(userVocabulary.userId, userId),
      eq(userVocabulary.vocabularyId, vocabularyId)
    ))
    .limit(1);

  if (existing.length === 0) return;

  const card = existing[0];
  
  // SM-2 Algorithm implementation
  let { easeFactor, interval, repetitions } = card;
  easeFactor = easeFactor / 100; // Convert back from stored format

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  // Determine status
  let status: 'new' | 'learning' | 'review' | 'mastered' = 'learning';
  if (repetitions === 0) status = 'learning';
  else if (repetitions >= 5 && easeFactor >= 2.5) status = 'mastered';
  else status = 'review';

  await db.update(userVocabulary)
    .set({
      easeFactor: Math.round(easeFactor * 100),
      interval,
      repetitions,
      nextReviewDate: nextReview,
      lastReviewedAt: new Date(),
      status
    })
    .where(eq(userVocabulary.id, card.id));
}

// ============ ACHIEVEMENT FUNCTIONS ============

export async function getAllAchievements() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(achievements);
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    userAchievement: userAchievements,
    achievement: achievements
  })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId));
}

export async function unlockAchievement(userId: number, achievementId: number) {
  const db = await getDb();
  if (!db) return;

  // Check if already unlocked
  const existing = await db.select()
    .from(userAchievements)
    .where(and(
      eq(userAchievements.userId, userId),
      eq(userAchievements.achievementId, achievementId)
    ))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userAchievements).values({
      userId,
      achievementId
    });

    // Get achievement XP reward
    const achievement = await db.select().from(achievements).where(eq(achievements.id, achievementId)).limit(1);
    if (achievement.length > 0) {
      await updateUserXp(userId, achievement[0].xpReward);
    }
  }
}

export async function createAchievement(achievement: InsertAchievement) {
  const db = await getDb();
  if (!db) return;

  await db.insert(achievements).values(achievement);
}

// ============ CONVERSATION SESSION FUNCTIONS ============

export async function createConversationSession(session: InsertConversationSession) {
  const db = await getDb();
  if (!db) return;

  const result = await db.insert(conversationSessions).values(session);
  return result[0].insertId;
}

export async function updateConversationSession(
  sessionId: number, 
  updates: Partial<InsertConversationSession>
) {
  const db = await getDb();
  if (!db) return;

  await db.update(conversationSessions)
    .set(updates)
    .where(eq(conversationSessions.id, sessionId));
}

export async function getUserConversationSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(conversationSessions)
    .where(eq(conversationSessions.userId, userId))
    .orderBy(desc(conversationSessions.startedAt));
}

// ============ AVATAR FUNCTIONS ============

export async function getAllAvatars() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(avatars).where(eq(avatars.isActive, true));
}

export async function getAvatarById(id: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(avatars).where(eq(avatars.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAvatar(avatar: InsertAvatar) {
  const db = await getDb();
  if (!db) return;

  await db.insert(avatars).values(avatar);
}

// ============ RECOMMENDATION FUNCTIONS ============

export async function getRecommendedLessons(userId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  const user = await getUserById(userId);
  if (!user) return [];

  const userProgress = await getAllUserProgress(userId);
  const completedLessonIds = userProgress
    .filter(p => p.status === 'completed')
    .map(p => p.lessonId);

  // Get lessons at user's preferred level that aren't completed
  let allLessons = await getAllLessons({ level: user.preferredLevel || 'A1' });
  
  // Filter out completed lessons
  const recommendedLessons = allLessons
    .filter(l => !completedLessonIds.includes(l.id))
    .slice(0, limit);

  // If not enough, add from next level
  if (recommendedLessons.length < limit) {
    const levels: ProficiencyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(user.preferredLevel || 'A1');
    if (currentIndex < levels.length - 1) {
      const nextLevelLessons = await getAllLessons({ level: levels[currentIndex + 1] });
      const additionalLessons = nextLevelLessons
        .filter(l => !completedLessonIds.includes(l.id))
        .slice(0, limit - recommendedLessons.length);
      recommendedLessons.push(...additionalLessons);
    }
  }

  return recommendedLessons;
}
