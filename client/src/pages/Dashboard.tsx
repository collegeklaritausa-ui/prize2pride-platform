import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  Trophy, 
  Flame, 
  Target, 
  BookOpen, 
  ChevronRight,
  Zap,
  Star,
  Calendar,
  TrendingUp,
  MessageCircle,
  BookMarked,
  ArrowLeft
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const { data: stats, isLoading: statsLoading } = trpc.user.getStats.useQuery(undefined, {
    enabled: isAuthenticated
  });

  const { data: recommendedLessons, isLoading: lessonsLoading } = trpc.lessons.getRecommended.useQuery(
    { limit: 4 },
    { enabled: isAuthenticated }
  );

  const { data: userAchievements } = trpc.achievements.getUserAchievements.useQuery(undefined, {
    enabled: isAuthenticated
  });

  // Update streak on dashboard visit
  const updateStreak = trpc.user.updateStreak.useMutation();
  useEffect(() => {
    if (isAuthenticated) {
      updateStreak.mutate();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const xpToNextLevel = stats ? (stats.level * 500) - stats.xp : 500;
  const xpProgress = stats ? ((stats.xp % 500) / 500) * 100 : 0;

  const levelBadgeColor = (level: string | null | undefined) => {
    const colors: Record<string, string> = {
      'A1': 'badge-a1',
      'A2': 'badge-a2',
      'B1': 'badge-b1',
      'B2': 'badge-b2',
      'C1': 'badge-c1',
      'C2': 'badge-c2'
    };
    return colors[level || 'A1'] || 'badge-a1';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Prize2Pride
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/lessons" className="text-muted-foreground hover:text-foreground transition-colors">
              Lessons
            </Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
              Practice
            </Link>
            <Link href="/vocabulary" className="text-muted-foreground hover:text-foreground transition-colors">
              Vocabulary
            </Link>
            <Link href="/achievements" className="text-muted-foreground hover:text-foreground transition-colors">
              Achievements
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-sm">{stats?.streak || 0}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{stats?.xp || 0} XP</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back, {user?.name || 'Learner'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your English learning journey. You're doing great!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-3xl font-bold">{stats?.level || 1}</div>
                <Progress value={xpProgress} className="mt-2 h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {xpToNextLevel} XP to next level
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-sm text-muted-foreground">Streak</div>
                </div>
                <div className="text-3xl font-bold">{stats?.streak || 0} days</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Keep it up! 🔥
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-sm text-muted-foreground">Lessons</div>
                </div>
                <div className="text-3xl font-bold">{stats?.completedLessons || 0}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Completed
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
                <div className="text-3xl font-bold">{stats?.achievementsCount || 0}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Unlocked
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Current Level & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="lg:col-span-2"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Card className="card-premium h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Your Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Badge className={`${levelBadgeColor(stats?.preferredLevel)} text-lg px-4 py-2`}>
                    {stats?.preferredLevel || 'A1'}
                  </Badge>
                  <div>
                    <div className="font-semibold">Current Level</div>
                    <div className="text-sm text-muted-foreground">
                      {stats?.preferredLevel === 'A1' && 'Beginner - Building foundations'}
                      {stats?.preferredLevel === 'A2' && 'Elementary - Expanding basics'}
                      {stats?.preferredLevel === 'B1' && 'Intermediate - Growing confidence'}
                      {stats?.preferredLevel === 'B2' && 'Upper Intermediate - Refining skills'}
                      {stats?.preferredLevel === 'C1' && 'Advanced - Near fluency'}
                      {stats?.preferredLevel === 'C2' && 'Mastery - Expert level'}
                      {!stats?.preferredLevel && 'Beginner - Building foundations'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/lessons">
                    <Button className="w-full h-auto py-4 gradient-navy text-white hover:opacity-90 btn-glow">
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        <span>Continue Learning</span>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/practice">
                    <Button variant="outline" className="w-full h-auto py-4 border-2">
                      <div className="flex flex-col items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        <span>Practice Speaking</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Card className="card-premium h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm">Complete 1 lesson</span>
                  </div>
                  <Badge variant="outline">+50 XP</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookMarked className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">Review 10 flashcards</span>
                  </div>
                  <Badge variant="outline">+25 XP</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Practice conversation</span>
                  </div>
                  <Badge variant="outline">+40 XP</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommended Lessons */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Recommended for You
            </h2>
            <Link href="/lessons">
              <Button variant="ghost" className="text-primary">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {lessonsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="card-premium">
                  <CardContent className="p-4">
                    <Skeleton className="h-32 w-full mb-4 rounded-lg" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recommendedLessons && recommendedLessons.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedLessons.map((lesson) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <Card className="card-premium h-full cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="aspect-video rounded-lg gradient-hero mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                        <BookOpen className="w-8 h-8 text-primary/50" />
                      </div>
                      <Badge className={`${levelBadgeColor(lesson.level)} mb-2`}>
                        {lesson.level}
                      </Badge>
                      <h3 className="font-semibold mb-1 line-clamp-1">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <span>{lesson.duration} min</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {lesson.xpReward} XP
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="card-premium">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-2">No lessons available yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check back soon for new content!
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Recent Achievements */}
        {userAchievements && userAchievements.length > 0 && (
          <motion.div
            className="mt-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Recent Achievements
              </h2>
              <Link href="/achievements">
                <Button variant="ghost" className="text-primary">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userAchievements.slice(0, 4).map(({ achievement, userAchievement }) => (
                <Card key={userAchievement.id} className="card-premium">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full gradient-gold flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </nav>
      <main className="container py-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-premium">
              <CardContent className="p-6">
                <Skeleton className="h-10 w-10 rounded-xl mb-3" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
