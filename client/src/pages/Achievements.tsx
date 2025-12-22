import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  Trophy, 
  ArrowLeft,
  Lock,
  Star,
  Flame,
  BookOpen,
  Zap,
  Award,
  Target
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getLoginUrl } from "@/const";
import { useMemo } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const categoryIcons: Record<string, any> = {
  'lessons': BookOpen,
  'vocabulary': Star,
  'streak': Flame,
  'level': Zap,
  'special': Award
};

const categoryColors: Record<string, string> = {
  'lessons': 'bg-emerald-100 text-emerald-600',
  'vocabulary': 'bg-blue-100 text-blue-600',
  'streak': 'bg-orange-100 text-orange-600',
  'level': 'bg-purple-100 text-purple-600',
  'special': 'bg-amber-100 text-amber-600'
};

export default function Achievements() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { data: allAchievements, isLoading: achievementsLoading } = trpc.achievements.list.useQuery();
  
  const { data: userAchievements } = trpc.achievements.getUserAchievements.useQuery(undefined, {
    enabled: isAuthenticated
  });

  const unlockedIds = useMemo(() => {
    return new Set(userAchievements?.map(ua => ua.achievement.id) || []);
  }, [userAchievements]);

  const { data: userStats } = trpc.user.getStats.useQuery(undefined, {
    enabled: isAuthenticated
  });

  if (authLoading || achievementsLoading) {
    return <AchievementsSkeleton />;
  }

  const totalXpFromAchievements = userAchievements?.reduce(
    (sum, ua) => sum + ua.achievement.xpReward, 
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
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
            <Link href="/achievements" className="text-foreground font-medium">
              Achievements
            </Link>
          </div>

          {isAuthenticated && (
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          )}
        </div>
      </nav>

      <main className="container py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Achievements
            </h1>
            <p className="text-muted-foreground">
              Track your progress and unlock rewards as you learn
            </p>
          </div>

          {/* Stats Summary */}
          {isAuthenticated && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                  <div className="text-2xl font-bold">{userAchievements?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Unlocked</div>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {(allAchievements?.length || 0) - (userAchievements?.length || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{totalXpFromAchievements}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">Level {userStats?.level || 1}</div>
                  <div className="text-sm text-muted-foreground">Current Level</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Achievement Categories */}
          {['lessons', 'vocabulary', 'streak', 'level', 'special'].map(category => {
            const categoryAchievements = allAchievements?.filter(a => a.category === category) || [];
            if (categoryAchievements.length === 0) return null;

            const Icon = categoryIcons[category] || Trophy;
            const colorClass = categoryColors[category] || 'bg-gray-100 text-gray-600';

            return (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold capitalize">
                    {category === 'lessons' ? 'Lesson Achievements' :
                     category === 'vocabulary' ? 'Vocabulary Achievements' :
                     category === 'streak' ? 'Streak Achievements' :
                     category === 'level' ? 'Level Achievements' :
                     'Special Achievements'}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryAchievements.map((achievement, index) => {
                    const isUnlocked = unlockedIds.has(achievement.id);
                    
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`card-premium ${!isUnlocked ? 'opacity-60' : ''}`}>
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isUnlocked ? 'gradient-gold' : 'bg-muted'
                              }`}>
                                {isUnlocked ? (
                                  <Trophy className="w-7 h-7 text-white" />
                                ) : (
                                  <Lock className="w-6 h-6 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{achievement.name}</h3>
                                  {isUnlocked && (
                                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                      Unlocked
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {achievement.description}
                                </p>
                                <div className="flex items-center gap-1 text-sm">
                                  <Zap className="w-4 h-4 text-primary" />
                                  <span className="font-medium">+{achievement.xpReward} XP</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {(!allAchievements || allAchievements.length === 0) && (
            <Card className="card-premium">
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start learning to unlock achievements and earn rewards!
                </p>
                <Link href="/lessons">
                  <Button className="gradient-navy text-white">
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Sign In Prompt */}
          {!isAuthenticated && allAchievements && allAchievements.length > 0 && (
            <Card className="card-premium mt-8 gradient-hero">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Sign in to track your achievements
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create an account to unlock achievements and track your progress
                </p>
                <a href={getLoginUrl()}>
                  <Button className="gradient-navy text-white">
                    Sign In
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function AchievementsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center h-16">
          <Skeleton className="h-9 w-32" />
        </div>
      </nav>
      <main className="container py-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-72 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
