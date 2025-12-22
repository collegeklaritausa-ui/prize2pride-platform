import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getAllLessons: vi.fn(),
  getLessonById: vi.fn(),
  getLessonExercises: vi.fn(),
  getLessonContent: vi.fn(),
  getRecommendedLessons: vi.fn(),
  getUserLessonProgress: vi.fn(),
  upsertUserLessonProgress: vi.fn(),
  getAllVocabulary: vi.fn(),
  getUserVocabulary: vi.fn(),
  addVocabularyToUser: vi.fn(),
  getDueFlashcards: vi.fn(),
  updateFlashcardReview: vi.fn(),
  getAllAchievements: vi.fn(),
  getUserAchievements: vi.fn(),
  getUserStats: vi.fn(),
  updateUserStreak: vi.fn(),
  updateUserXp: vi.fn(),
  createConversationSession: vi.fn(),
  getConversationSession: vi.fn(),
  updateConversationSession: vi.fn(),
  endConversationSession: vi.fn(),
  recordExerciseAttempt: vi.fn(),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    xp: 500,
    level: 3,
    streak: 5,
    lastActivityDate: new Date(),
    preferredLevel: "A2",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("lessons.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all lessons when no filters are provided", async () => {
    const mockLessons = [
      { id: 1, title: "Greetings", level: "A1", category: "daily_conversation", duration: 15, xpReward: 50, order: 1 },
      { id: 2, title: "At the Coffee Shop", level: "A1", category: "daily_conversation", duration: 20, xpReward: 60, order: 2 },
    ];
    
    vi.mocked(db.getAllLessons).mockResolvedValue(mockLessons as any);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.lessons.list({});
    
    expect(result).toEqual(mockLessons);
    expect(db.getAllLessons).toHaveBeenCalled();
  });

  it("filters lessons by level", async () => {
    const mockLessons = [
      { id: 1, title: "Greetings", level: "A1", category: "daily_conversation", duration: 15, xpReward: 50, order: 1 },
    ];
    
    vi.mocked(db.getAllLessons).mockResolvedValue(mockLessons as any);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.lessons.list({ level: "A1" });
    
    expect(result).toEqual(mockLessons);
    expect(db.getAllLessons).toHaveBeenCalled();
  });

  it("filters lessons by category", async () => {
    const mockLessons = [
      { id: 7, title: "Job Interview", level: "B1", category: "business", duration: 30, xpReward: 100, order: 7 },
    ];
    
    vi.mocked(db.getAllLessons).mockResolvedValue(mockLessons as any);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.lessons.list({ category: "business" });
    
    expect(result).toEqual(mockLessons);
    expect(db.getAllLessons).toHaveBeenCalled();
  });
});

describe("lessons.getById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns lesson with content and exercises", async () => {
    const mockLesson = { id: 1, title: "Greetings", level: "A1", category: "daily_conversation", duration: 15, xpReward: 50 };
    const mockContent = [{ id: 1, lessonId: 1, type: "scenario", content: "Test content" }];
    const mockExercises = [{ id: 1, lessonId: 1, type: "multiple_choice", question: "Test question" }];
    
    vi.mocked(db.getLessonById).mockResolvedValue(mockLesson as any);
    vi.mocked(db.getLessonContent).mockResolvedValue(mockContent as any);
    vi.mocked(db.getLessonExercises).mockResolvedValue(mockExercises as any);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.lessons.getById({ id: 1 });
    
    expect(result?.lesson).toEqual(mockLesson);
    expect(result?.content).toEqual(mockContent);
    expect(result?.exercises).toEqual(mockExercises);
  });

  it("returns null when lesson not found", async () => {
    vi.mocked(db.getLessonById).mockResolvedValue(undefined);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.lessons.getById({ id: 999 });
    
    expect(result).toBeNull();
  });
});

describe("lessons.getRecommended", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns recommended lessons for authenticated user", async () => {
    const mockLessons = [
      { id: 4, title: "Making Small Talk", level: "A2", category: "social", duration: 20, xpReward: 70 },
    ];
    
    vi.mocked(db.getRecommendedLessons).mockResolvedValue(mockLessons as any);
    
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.lessons.getRecommended({ limit: 4 });
    
    expect(result).toEqual(mockLessons);
    expect(db.getRecommendedLessons).toHaveBeenCalledWith(1, 4);
  });
});

describe("vocabulary.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all vocabulary when no level filter", async () => {
    const mockVocab = [
      { id: 1, word: "Hello", definition: "A greeting", level: "A1" },
      { id: 2, word: "Awesome", definition: "Extremely good", level: "A2" },
    ];
    
    vi.mocked(db.getAllVocabulary).mockResolvedValue(mockVocab as any);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.vocabulary.list({});
    
    expect(result).toEqual(mockVocab);
    expect(db.getAllVocabulary).toHaveBeenCalledWith(undefined);
  });

  it("filters vocabulary by level", async () => {
    const mockVocab = [
      { id: 1, word: "Hello", definition: "A greeting", level: "A1" },
    ];
    
    vi.mocked(db.getAllVocabulary).mockResolvedValue(mockVocab as any);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.vocabulary.list({ level: "A1" });
    
    expect(result).toEqual(mockVocab);
    expect(db.getAllVocabulary).toHaveBeenCalledWith("A1");
  });
});

describe("achievements.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all achievements", async () => {
    const mockAchievements = [
      { id: 1, name: "First Steps", description: "Complete your first lesson", category: "lessons", xpReward: 50 },
      { id: 2, name: "Word Collector", description: "Learn 10 vocabulary words", category: "vocabulary", xpReward: 50 },
    ];
    
    vi.mocked(db.getAllAchievements).mockResolvedValue(mockAchievements as any);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.achievements.list();
    
    expect(result).toEqual(mockAchievements);
    expect(db.getAllAchievements).toHaveBeenCalled();
  });
});

describe("user.getStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user stats for authenticated user", async () => {
    const mockStats = {
      xp: 500,
      level: 3,
      streak: 5,
      preferredLevel: "A2",
      completedLessons: 10,
      achievementsCount: 3,
    };
    
    vi.mocked(db.getUserStats).mockResolvedValue(mockStats as any);
    
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.user.getStats();
    
    expect(result).toEqual(mockStats);
    expect(db.getUserStats).toHaveBeenCalledWith(1);
  });
});

describe("user.updateStreak", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates user streak for authenticated user", async () => {
    vi.mocked(db.updateUserStreak).mockResolvedValue({ streak: 6, xpBonus: 10 });
    
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.user.updateStreak();
    
    expect(result).toEqual({ streak: { streak: 6, xpBonus: 10 } });
    expect(db.updateUserStreak).toHaveBeenCalledWith(1);
  });
});
