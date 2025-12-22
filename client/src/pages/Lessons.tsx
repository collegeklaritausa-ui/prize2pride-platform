import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  Zap,
  Clock,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const categories = [
  { id: 'all', label: 'All Topics' },
  { id: 'daily_conversation', label: 'Daily Conversation' },
  { id: 'business', label: 'Business' },
  { id: 'travel', label: 'Travel' },
  { id: 'academic', label: 'Academic' },
  { id: 'social', label: 'Social' },
  { id: 'culture', label: 'Culture' },
  { id: 'idioms', label: 'Idioms' },
  { id: 'pronunciation', label: 'Pronunciation' }
] as const;

export default function Lessons() {
  const { isAuthenticated } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: lessons, isLoading } = trpc.lessons.list.useQuery({
    level: selectedLevel !== 'all' ? selectedLevel as typeof levels[number] : undefined,
    category: selectedCategory !== 'all' ? selectedCategory as any : undefined,
  });

  const filteredLessons = lessons?.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'daily_conversation': 'Daily Conversation',
      'business': 'Business',
      'travel': 'Travel',
      'academic': 'Academic',
      'social': 'Social',
      'culture': 'Culture',
      'idioms': 'Idioms',
      'pronunciation': 'Pronunciation'
    };
    return labels[cat] || cat;
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
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Prize2Pride
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/lessons" className="text-foreground font-medium">
              Lessons
            </Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
              Practice
            </Link>
            <Link href="/vocabulary" className="text-muted-foreground hover:text-foreground transition-colors">
              Vocabulary
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
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Lesson Library
          </h1>
          <p className="text-muted-foreground">
            Explore our comprehensive collection of American English lessons
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
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel('all')}
              className={selectedLevel === 'all' ? 'gradient-navy text-white' : ''}
            >
              All Levels
            </Button>
            {levels.map(level => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className={selectedLevel === level ? 'gradient-navy text-white' : ''}
              >
                {level}
              </Button>
            ))}
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
              {categories.map(cat => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
                >
                  {cat.label}
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
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/lessons/${lesson.id}`}>
                  <Card className="card-premium h-full cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="aspect-video rounded-lg gradient-hero mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform overflow-hidden">
                        <BookOpen className="w-12 h-12 text-primary/30" />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={levelBadgeColor(lesson.level)}>
                          {lesson.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {categoryLabel(lesson.category)}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {lesson.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-primary" />
                          <span>{lesson.xpReward} XP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">No lessons found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try adjusting your search or filters"
                  : "No lessons available for the selected filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
