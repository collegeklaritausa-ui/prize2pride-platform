import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Zap,
  BookOpen,
  BookMarked,
  Clock,
  Flame,
  Trophy,
  Target,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

interface WeeklyReportData {
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
  comparison: {
    xpChange: number;
    lessonsChange: number;
    streakChange: number;
  };
}

interface WeeklyReportProps {
  data: WeeklyReportData;
}

function TrendIndicator({ value, suffix = '' }: { value: number; suffix?: string }) {
  if (value > 0) {
    return (
      <span className="flex items-center gap-1 text-green-500 text-sm">
        <TrendingUp className="w-4 h-4" />
        +{value}{suffix}
      </span>
    );
  } else if (value < 0) {
    return (
      <span className="flex items-center gap-1 text-red-500 text-sm">
        <TrendingDown className="w-4 h-4" />
        {value}{suffix}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-muted-foreground text-sm">
      <Minus className="w-4 h-4" />
      No change
    </span>
  );
}

export function WeeklyReport({ data }: WeeklyReportProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const stats = [
    {
      icon: Zap,
      label: 'XP Earned',
      value: data.totalXp,
      change: data.comparison.xpChange,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: BookOpen,
      label: 'Lessons',
      value: data.lessonsCompleted,
      change: data.comparison.lessonsChange,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: BookMarked,
      label: 'Vocabulary',
      value: data.vocabularyMastered,
      change: 0,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Clock,
      label: 'Practice Time',
      value: `${data.practiceMinutes}m`,
      change: 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Weekly Progress Report</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(data.weekStart)} - {formatDate(data.weekEnd)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${stat.bgColor}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.change !== 0 && <TrendIndicator value={stat.change} />}
              </motion.div>
            );
          })}
        </div>

        {/* Streak & Score */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-orange-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-medium">Learning Streak</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{data.streakDays}</span>
              <span className="text-muted-foreground">days this week</span>
            </div>
            <TrendIndicator value={data.comparison.streakChange} suffix=" days" />
          </div>

          <div className="p-4 rounded-lg bg-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-medium">Average Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{data.averageScore}%</span>
            </div>
            <Progress value={data.averageScore} className="h-2 mt-2" />
          </div>
        </div>

        {/* Strongest Category */}
        <div className="p-4 rounded-lg bg-green-500/10 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-500" />
            <span className="font-medium">Strongest Category</span>
          </div>
          <p className="text-lg font-semibold capitalize">
            {data.strongestCategory.replace('_', ' ')}
          </p>
        </div>

        {/* Improvement Areas */}
        {data.improvementAreas.length > 0 && (
          <div className="p-4 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Areas for Improvement</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.improvementAreas.map((area, index) => (
                <Badge key={index} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div className="p-4 rounded-lg bg-yellow-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Achievements Unlocked</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.achievements.map((achievement, index) => (
                <Badge key={index} className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                  🏆 {achievement}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WeeklyReport;
