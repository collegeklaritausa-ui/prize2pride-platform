import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  Zap,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  Play,
  Crown,
  Gem
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useAmosLessonTrigger, LessonData } from "@/hooks/useAmosLessonTrigger";
import { AmosLessonModal } from "@/components/AmosLessonModal";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const categoryIds = [
  'all',
  'daily_conversation',
  'business',
  'travel',
  'academic',
  'social',
  'culture',
  'idioms',
  'pronunciation'
] as const;

// Level color mapping for stunning visual design
const levelColors: Record<string, { bg: string; text: string; glow: string }> = {
  'A1': { bg: 'from-emerald-500 to-green-600', text: 'text-emerald-500', glow: 'shadow-emerald-500/30' },
  'A2': { bg: 'from-lime-500 to-green-500', text: 'text-lime-500', glow: 'shadow-lime-500/30' },
  'B1': { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-500', glow: 'shadow-amber-500/30' },
  'B2': { bg: 'from-orange-500 to-amber-500', text: 'text-orange-500', glow: 'shadow-orange-500/30' },
  'C1': { bg: 'from-red-500 to-rose-500', text: 'text-red-500', glow: 'shadow-red-500/30' },
  'C2': { bg: 'from-purple-500 to-violet-600', text: 'text-purple-500', glow: 'shadow-purple-500/30' },
};

export default function Lessons() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AMOS Lesson Trigger Hook
  const {
    isLoading: isAmosLoading,
    isPlaying,
    currentLesson,
    amosOutput,
    error: amosError,
    onLessonClick,
    stopLesson,
  } = useAmosLessonTrigger();

  const { data: lessons, isLoading } = trpc.lessons.list.useQuery({
    level: selectedLevel !== 'all' ? selectedLevel as typeof levels[number] : undefined,
    category: selectedCategory !== 'all' ? selectedCategory as any : undefined,
  });

  const filteredLessons = lessons?.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * onLessonClick Handler - Triggers AMOS Hyper-Realistic Video Generation
   * This is the main entry point for the Autonomous Multimedia Orchestration System
   */
  const handleLessonClick = useCallback(async (lesson: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Transform lesson data for AMOS
    const lessonData: LessonData = {
      id: lesson.id,
      fileId: lesson.fileId,
      title: lesson.title,
      description: lesson.description || '',
      level: lesson.level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
      category: lesson.category,
      duration: lesson.duration || 15,
      xpReward: lesson.xpReward || 50,
      avatarId: lesson.avatarId || 'nova',
      content: lesson.content,
      objectives: lesson.objectives || [],
    };

    // Open modal immediately for better UX
    setIsModalOpen(true);

    // Trigger AMOS orchestration
    try {
      await onLessonClick(lessonData);
    } catch (error) {
      console.error('[Lessons] AMOS trigger failed:', error);
    }
  }, [onLessonClick]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    stopLesson();
  }, [stopLesson]);

  const levelBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'badge-a1',
      'A2': 'badge-a2',
      'B1': 'badge-b1',
      'B2': 'badge-b2',
      'C1': 'badge-c1',
      'C2': 'badge-c2'
    };
    return colors[level] || 'badge-a1';
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'all') return t('lessons.allTopics');
    return t(`lessons.categories.${cat}`);
  };

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
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("common.appName")}
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/lessons" className="text-foreground font-medium">
              {t("nav.lessons")}
            </Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.practice")}
            </Link>
            <Link href="/vocabulary" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.vocabulary")}
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Gem className="w-4 h-4 text-amber-500" />
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button variant="outline">{t("nav.dashboard")}</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container py-8">
        {/* Header with Gold & Diamond Branding */}
        <motion.div 
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("lessons.title")}
            </h1>
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold">
              <Sparkles className="w-3 h-3 mr-1" />
              301 Lessons
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {t("lessons.subtitle")} • Click any lesson to start the AI-powered learning experience
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="mb-8 space-y-4"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("lessons.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Level Filter with colorful badges */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel('all')}
              className={selectedLevel === 'all' ? 'gradient-navy text-white' : ''}
            >
              {t("lessons.allLevels")}
            </Button>
            {levels.map(level => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className={selectedLevel === level 
                  ? `bg-gradient-to-r ${levelColors[level].bg} text-white border-0` 
                  : `${levelColors[level].text} border-current hover:${levelColors[level].text}`
                }
              >
                {level}
              </Button>
            ))}
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
              {categoryIds.map(cat => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
                >
                  {getCategoryLabel(cat)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Lessons Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="card-premium">
                <CardContent className="p-5">
                  <Skeleton className="aspect-video w-full mb-4 rounded-lg" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredLessons && filteredLessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {/* Lesson Card with onLessonClick trigger */}
                <Card 
                  className={`card-premium h-full cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${levelColors[lesson.level]?.glow || ''}`}
                  onClick={(e) => handleLessonClick(lesson, e)}
                >
                  {/* Hover overlay with Play button */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${levelColors[lesson.level]?.bg || 'from-amber-500 to-yellow-400'} flex items-center justify-center shadow-2xl`}
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                  </div>

                  <CardContent className="p-5 relative">
                    {/* Lesson thumbnail with gradient */}
                    <div className={`aspect-video rounded-lg bg-gradient-to-br ${levelColors[lesson.level]?.bg || 'from-amber-500 to-yellow-400'} mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform overflow-hidden relative`}>
                      <BookOpen className="w-12 h-12 text-white/30" />
                      {/* Level badge overlay */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-full text-xs font-bold text-white">
                        {lesson.level}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={levelBadgeColor(lesson.level)}>
                        {lesson.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t(`lessons.categories.${lesson.category}`)}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {lesson.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {lesson.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration} {t("lessons.duration")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-500 font-semibold">{lesson.xpReward} XP</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">{t("lessons.noLessons")}</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? t("lessons.noLessonsHint")
                  : t("lessons.noLessonsHint")}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                {t("lessons.clearFilters")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lesson count footer */}
        {filteredLessons && filteredLessons.length > 0 && (
          <motion.div 
            className="mt-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Showing <span className="font-semibold text-foreground">{filteredLessons.length}</span> lessons
              {selectedLevel !== 'all' && ` for level ${selectedLevel}`}
              {selectedCategory !== 'all' && ` in ${getCategoryLabel(selectedCategory)}`}
            </p>
          </motion.div>
        )}
      </main>

      {/* AMOS Lesson Modal - Hyper-Realistic Video Generation Display */}
      <AmosLessonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lessonTitle={currentLesson?.title || 'Loading...'}
        lessonLevel={currentLesson?.level || 'A1'}
        amosOutput={amosOutput}
        isLoading={isAmosLoading}
      />
    </div>
  );
}
