import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  // Gamification fields
  xp: int("xp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  streak: int("streak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
  preferredLevel: mysqlEnum("preferredLevel", ["A1", "A2", "B1", "B2", "C1", "C2"]).default("A1"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Proficiency levels for lessons
 */
export const proficiencyLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type ProficiencyLevel = typeof proficiencyLevels[number];

/**
 * Lesson categories
 */
export const lessonCategories = [
  "daily_conversation",
  "business",
  "travel",
  "academic",
  "social",
  "culture",
  "idioms",
  "pronunciation"
] as const;
export type LessonCategory = typeof lessonCategories[number];

/**
 * Lessons table - stores all learning modules
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  level: mysqlEnum("level", ["A1", "A2", "B1", "B2", "C1", "C2"]).notNull(),
  category: mysqlEnum("category", [
    "daily_conversation",
    "business",
    "travel",
    "academic",
    "social",
    "culture",
    "idioms",
    "pronunciation"
  ]).notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  duration: int("duration").default(15), // minutes
  xpReward: int("xpReward").default(50).notNull(),
  order: int("order").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Lesson content - scenarios and dialogues within lessons
 */
export const lessonContent = mysqlTable("lesson_content", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  type: mysqlEnum("type", ["scenario", "dialogue", "explanation", "tip"]).notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(), // JSON content for scenarios/dialogues
  avatarId: varchar("avatarId", { length: 64 }), // Which avatar presents this content
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LessonContent = typeof lessonContent.$inferSelect;
export type InsertLessonContent = typeof lessonContent.$inferInsert;

/**
 * Exercises within lessons
 */
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  type: mysqlEnum("type", ["listening", "speaking", "vocabulary", "grammar", "fill_blank", "multiple_choice"]).notNull(),
  question: text("question").notNull(),
  options: json("options"), // JSON array of options for multiple choice
  correctAnswer: text("correctAnswer").notNull(),
  explanation: text("explanation"),
  audioUrl: text("audioUrl"), // For listening exercises
  xpReward: int("xpReward").default(10).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

/**
 * User progress on lessons
 */
export const userLessonProgress = mysqlTable("user_lesson_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  progress: int("progress").default(0).notNull(), // percentage 0-100
  score: int("score").default(0), // final score if completed
  xpEarned: int("xpEarned").default(0).notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  lastAccessedAt: timestamp("lastAccessedAt").defaultNow().notNull(),
});

export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserLessonProgress = typeof userLessonProgress.$inferInsert;

/**
 * User exercise attempts
 */
export const userExerciseAttempts = mysqlTable("user_exercise_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  exerciseId: int("exerciseId").notNull(),
  userAnswer: text("userAnswer").notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});

export type UserExerciseAttempt = typeof userExerciseAttempts.$inferSelect;
export type InsertUserExerciseAttempt = typeof userExerciseAttempts.$inferInsert;

/**
 * Vocabulary items
 */
export const vocabulary = mysqlTable("vocabulary", {
  id: int("id").autoincrement().primaryKey(),
  word: varchar("word", { length: 255 }).notNull(),
  definition: text("definition").notNull(),
  pronunciation: varchar("pronunciation", { length: 255 }),
  partOfSpeech: varchar("partOfSpeech", { length: 64 }),
  exampleSentence: text("exampleSentence"),
  audioUrl: text("audioUrl"),
  level: mysqlEnum("level", ["A1", "A2", "B1", "B2", "C1", "C2"]).notNull(),
  category: varchar("category", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vocabulary = typeof vocabulary.$inferSelect;
export type InsertVocabulary = typeof vocabulary.$inferInsert;

/**
 * User vocabulary (flashcards with spaced repetition)
 */
export const userVocabulary = mysqlTable("user_vocabulary", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  vocabularyId: int("vocabularyId").notNull(),
  // Spaced repetition fields
  easeFactor: int("easeFactor").default(250).notNull(), // multiplied by 100 for precision
  interval: int("interval").default(1).notNull(), // days until next review
  repetitions: int("repetitions").default(0).notNull(),
  nextReviewDate: timestamp("nextReviewDate").defaultNow().notNull(),
  lastReviewedAt: timestamp("lastReviewedAt"),
  status: mysqlEnum("status", ["new", "learning", "review", "mastered"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserVocabulary = typeof userVocabulary.$inferSelect;
export type InsertUserVocabulary = typeof userVocabulary.$inferInsert;

/**
 * Achievements/Badges
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  iconUrl: text("iconUrl"),
  xpReward: int("xpReward").default(100).notNull(),
  requirement: text("requirement").notNull(), // JSON describing unlock condition
  category: mysqlEnum("category", ["lessons", "vocabulary", "streak", "level", "special"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User achievements
 */
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * Conversation sessions for AI practice
 */
export const conversationSessions = mysqlTable("conversation_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  scenarioId: varchar("scenarioId", { length: 64 }).notNull(),
  avatarId: varchar("avatarId", { length: 64 }).notNull(),
  messages: json("messages"), // JSON array of conversation messages
  feedback: text("feedback"),
  score: int("score"),
  xpEarned: int("xpEarned").default(0).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});

export type ConversationSession = typeof conversationSessions.$inferSelect;
export type InsertConversationSession = typeof conversationSessions.$inferInsert;

/**
 * Avatar definitions
 */
export const avatars = mysqlTable("avatars", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  personality: text("personality").notNull(), // Description for AI prompting
  avatarUrl: text("avatarUrl"),
  voiceId: varchar("voiceId", { length: 64 }),
  specialty: varchar("specialty", { length: 255 }), // e.g., "Business English", "Casual Conversation"
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Avatar = typeof avatars.$inferSelect;
export type InsertAvatar = typeof avatars.$inferInsert;
