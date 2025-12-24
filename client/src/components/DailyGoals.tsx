import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Zap, 
  BookOpen, 
  BookMarked, 
  Clock,
  CheckCircle2,
  Flame,
  Trophy,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface DailyGoal {
  id: string;
  type: 'xp' | 'lessons' | 'vocabulary' | 'practice';
  target: number;
  current: number;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface DailyGoalsProps {
  userStats: {
    xp: number;
    completedLessons: number;
    reviewedVocabulary: number;
    practiceMinutes: number;
  };
  userLevel: string;
}

const goalConfigs: Record<string, { xp: number; lessons: number; vocabulary: number; practice: number }> = {
  'A1': { xp: 50, lessons: 1, vocabulary: 5, practice: 15 },
  'A2': { xp: 75, lessons: 1, vocabulary: 8, practice: 20 },
  'B1': { xp: 100, lessons: 2, vocabulary: 10, practice: 25 },
  'B2': { xp: 125, lessons: 2, vocabulary: 12, practice: 30 },
  'C1': { xp: 150, lessons: 2, vocabulary: 15, practice: 35 },
  'C2': { xp: 200, lessons: 3, vocabulary: 20, practice: 45 },
};

export function DailyGoals({ userStats, userLevel }: DailyGoalsProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const config = goalConfigs[userLevel] || goalConfigs['A1'];

  const goals: DailyGoal[] = [
    {
      id: 'xp',
      type: 'xp',
      target: config.xp,
      current: userStats.xp,
      label: 'Earn XP',
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      id: 'lessons',
      type: 'lessons',
      target: config.lessons,
      current: userStats.completedLessons,
      label: 'Complete Lessons',
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      id: 'vocabulary',
      type: 'vocabulary',
      target: config.vocabulary,
      current: userStats.reviewedVocabulary,
      label: 'Review Vocabulary',
      icon: BookMarked,
      color: 'text-green-500'
    },
    {
      id: 'practice',
      type: 'practice',
      target: config.practice,
      current: userStats.practiceMinutes,
      label: 'Practice Minutes',
      icon: Clock,
      color: 'text-purple-500'
    }
  ];

  const completedGoals = goals.filter(g => g.current >= g.target).length;
  const allGoalsCompleted = completedGoals === goals.length;
  const overallProgress = Math.round(
    goals.reduce((sum, g) => sum + Math.min(g.current / g.target, 1), 0) / goals.length * 100
  );

  useEffect(() => {
    if (allGoalsCompleted && !showCelebration) {
      setShowCelebration(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [allGoalsCompleted]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Daily Goals</CardTitle>
          </div>
          <Badge variant={allGoalsCompleted ? "default" : "secondary"} className="gap-1">
            {allGoalsCompleted ? (
              <>
                <Trophy className="w-3 h-3" />
                Completed!
              </>
            ) : (
              <>
                {completedGoals}/{goals.length}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Individual Goals */}
        <div className="space-y-3">
          {goals.map((goal, index) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = goal.current >= goal.target;
            const Icon = goal.icon;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCompleted ? 'bg-green-500/10' : 'bg-muted/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500/20' : 'bg-background'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Icon className={`w-5 h-5 ${goal.color}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{goal.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-1.5 ${isCompleted ? '[&>div]:bg-green-500' : ''}`} 
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-4 p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">All Goals Completed!</span>
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Amazing work! You've crushed all your daily goals. Keep the momentum going!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        {!allGoalsCompleted && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" size="sm" className="w-full justify-between group">
              <span className="text-sm">Continue where you left off</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DailyGoals;
