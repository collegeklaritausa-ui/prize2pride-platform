/**
 * Progress Tracking Service for Prize2Pride Platform
 * Handles daily goals, weekly reports, and learning analytics
 */

interface DailyGoal {
  id: string;
  userId: number;
  date: string;
  targetXp: number;
  targetLessons: number;
  targetVocabulary: number;
  targetPracticeMinutes: number;
  earnedXp: number;
  completedLessons: number;
  reviewedVocabulary: number;
  practiceMinutes: number;
  isCompleted: boolean;
}

interface WeeklyReport {
  userId: number;
  weekStart: string;
  weekEnd: string;
  totalXp: number;
  lessonsCompleted: number;
  vocabularyMastered: number;
  practiceMinutes: number;
  streakDays: number;
  averageScore: number;
  strongestCategory: string;
  improvementAreas: string[];
  achievements: string[];
  comparisonToPreviousWeek: {
    xpChange: number;
    lessonsChange: number;
    streakChange: number;
  };
}

interface LearningAnalytics {
  totalLearningTime: number;
  averageSessionDuration: number;
  preferredLearningTime: string;
  strongestSkills: string[];
  areasForImprovement: string[];
  vocabularyRetentionRate: number;
  lessonCompletionRate: number;
  currentLevel: string;
  progressToNextLevel: number;
}

/**
 * Default daily goals based on user level
 */
const defaultGoalsByLevel: Record<string, Partial<DailyGoal>> = {
  'A1': { targetXp: 50, targetLessons: 1, targetVocabulary: 5, targetPracticeMinutes: 15 },
  'A2': { targetXp: 75, targetLessons: 1, targetVocabulary: 8, targetPracticeMinutes: 20 },
  'B1': { targetXp: 100, targetLessons: 2, targetVocabulary: 10, targetPracticeMinutes: 25 },
  'B2': { targetXp: 125, targetLessons: 2, targetVocabulary: 12, targetPracticeMinutes: 30 },
  'C1': { targetXp: 150, targetLessons: 2, targetVocabulary: 15, targetPracticeMinutes: 35 },
  'C2': { targetXp: 200, targetLessons: 3, targetVocabulary: 20, targetPracticeMinutes: 45 },
};

/**
 * Create daily goals for a user
 */
export function createDailyGoal(userId: number, level: string = 'A1'): DailyGoal {
  const defaults = defaultGoalsByLevel[level] || defaultGoalsByLevel['A1'];
  const today = new Date().toISOString().split('T')[0];
  
  return {
    id: `goal-${userId}-${today}`,
    userId,
    date: today,
    targetXp: defaults.targetXp!,
    targetLessons: defaults.targetLessons!,
    targetVocabulary: defaults.targetVocabulary!,
    targetPracticeMinutes: defaults.targetPracticeMinutes!,
    earnedXp: 0,
    completedLessons: 0,
    reviewedVocabulary: 0,
    practiceMinutes: 0,
    isCompleted: false
  };
}

/**
 * Update daily goal progress
 */
export function updateDailyGoalProgress(
  goal: DailyGoal,
  updates: Partial<Pick<DailyGoal, 'earnedXp' | 'completedLessons' | 'reviewedVocabulary' | 'practiceMinutes'>>
): DailyGoal {
  const updated = {
    ...goal,
    earnedXp: goal.earnedXp + (updates.earnedXp || 0),
    completedLessons: goal.completedLessons + (updates.completedLessons || 0),
    reviewedVocabulary: goal.reviewedVocabulary + (updates.reviewedVocabulary || 0),
    practiceMinutes: goal.practiceMinutes + (updates.practiceMinutes || 0),
  };
  
  // Check if all goals are met
  updated.isCompleted = 
    updated.earnedXp >= updated.targetXp &&
    updated.completedLessons >= updated.targetLessons &&
    updated.reviewedVocabulary >= updated.targetVocabulary &&
    updated.practiceMinutes >= updated.targetPracticeMinutes;
  
  return updated;
}

/**
 * Calculate goal completion percentage
 */
export function calculateGoalProgress(goal: DailyGoal): number {
  const xpProgress = Math.min(goal.earnedXp / goal.targetXp, 1);
  const lessonsProgress = Math.min(goal.completedLessons / goal.targetLessons, 1);
  const vocabProgress = Math.min(goal.reviewedVocabulary / goal.targetVocabulary, 1);
  const practiceProgress = Math.min(goal.practiceMinutes / goal.targetPracticeMinutes, 1);
  
  return Math.round(((xpProgress + lessonsProgress + vocabProgress + practiceProgress) / 4) * 100);
}

/**
 * Generate weekly progress report
 */
export function generateWeeklyReport(
  userId: number,
  weekData: {
    dailyGoals: DailyGoal[];
    lessonsCompleted: { score: number; category: string }[];
    vocabularyReviewed: number;
    achievementsUnlocked: string[];
    previousWeekXp?: number;
    previousWeekLessons?: number;
    previousWeekStreak?: number;
  }
): WeeklyReport {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  
  const totalXp = weekData.dailyGoals.reduce((sum, g) => sum + g.earnedXp, 0);
  const lessonsCompleted = weekData.lessonsCompleted.length;
  const practiceMinutes = weekData.dailyGoals.reduce((sum, g) => sum + g.practiceMinutes, 0);
  const streakDays = weekData.dailyGoals.filter(g => g.earnedXp > 0).length;
  
  // Calculate average score
  const averageScore = lessonsCompleted > 0
    ? Math.round(weekData.lessonsCompleted.reduce((sum, l) => sum + l.score, 0) / lessonsCompleted)
    : 0;
  
  // Find strongest category
  const categoryScores: Record<string, number[]> = {};
  weekData.lessonsCompleted.forEach(lesson => {
    if (!categoryScores[lesson.category]) {
      categoryScores[lesson.category] = [];
    }
    categoryScores[lesson.category].push(lesson.score);
  });
  
  let strongestCategory = 'N/A';
  let highestAvg = 0;
  Object.entries(categoryScores).forEach(([category, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > highestAvg) {
      highestAvg = avg;
      strongestCategory = category;
    }
  });
  
  // Identify improvement areas
  const improvementAreas: string[] = [];
  if (averageScore < 70) improvementAreas.push('Overall accuracy');
  if (practiceMinutes < 100) improvementAreas.push('Practice time');
  if (weekData.vocabularyReviewed < 30) improvementAreas.push('Vocabulary review');
  
  return {
    userId,
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: now.toISOString().split('T')[0],
    totalXp,
    lessonsCompleted,
    vocabularyMastered: weekData.vocabularyReviewed,
    practiceMinutes,
    streakDays,
    averageScore,
    strongestCategory,
    improvementAreas,
    achievements: weekData.achievementsUnlocked,
    comparisonToPreviousWeek: {
      xpChange: totalXp - (weekData.previousWeekXp || 0),
      lessonsChange: lessonsCompleted - (weekData.previousWeekLessons || 0),
      streakChange: streakDays - (weekData.previousWeekStreak || 0),
    }
  };
}

/**
 * Generate learning analytics summary
 */
export function generateLearningAnalytics(
  userData: {
    totalMinutes: number;
    sessionCount: number;
    sessionTimes: Date[];
    skillScores: Record<string, number>;
    vocabularyStats: { total: number; mastered: number };
    lessonStats: { total: number; completed: number };
    currentXp: number;
    currentLevel: number;
  }
): LearningAnalytics {
  // Calculate average session duration
  const averageSessionDuration = userData.sessionCount > 0
    ? Math.round(userData.totalMinutes / userData.sessionCount)
    : 0;
  
  // Determine preferred learning time
  const hourCounts: Record<number, number> = {};
  userData.sessionTimes.forEach(time => {
    const hour = time.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  let preferredHour = 12;
  let maxCount = 0;
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      preferredHour = parseInt(hour);
    }
  });
  
  const preferredLearningTime = preferredHour < 12 ? 'Morning' : preferredHour < 17 ? 'Afternoon' : 'Evening';
  
  // Sort skills by score
  const sortedSkills = Object.entries(userData.skillScores)
    .sort(([, a], [, b]) => b - a);
  
  const strongestSkills = sortedSkills.slice(0, 3).map(([skill]) => skill);
  const areasForImprovement = sortedSkills.slice(-3).map(([skill]) => skill);
  
  // Calculate rates
  const vocabularyRetentionRate = userData.vocabularyStats.total > 0
    ? Math.round((userData.vocabularyStats.mastered / userData.vocabularyStats.total) * 100)
    : 0;
  
  const lessonCompletionRate = userData.lessonStats.total > 0
    ? Math.round((userData.lessonStats.completed / userData.lessonStats.total) * 100)
    : 0;
  
  // Calculate progress to next level
  const xpPerLevel = 500;
  const currentLevelXp = userData.currentXp % xpPerLevel;
  const progressToNextLevel = Math.round((currentLevelXp / xpPerLevel) * 100);
  
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentLevel = levels[Math.min(userData.currentLevel - 1, 5)];
  
  return {
    totalLearningTime: userData.totalMinutes,
    averageSessionDuration,
    preferredLearningTime,
    strongestSkills,
    areasForImprovement,
    vocabularyRetentionRate,
    lessonCompletionRate,
    currentLevel,
    progressToNextLevel
  };
}

export type { DailyGoal, WeeklyReport, LearningAnalytics };
