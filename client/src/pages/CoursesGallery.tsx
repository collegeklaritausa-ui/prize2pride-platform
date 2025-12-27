/**
 * CoursesGallery - Stunning Course Browser with Colorful Cards
 * Prize2Pride American English Learning Platform
 * 
 * Features:
 * - Luxurious card design with level-based colors
 * - Animated hover effects and transitions
 * - Progress tracking visualization
 * - Host couple previews
 * - Filter by level and category
 * 
 * Marketed by CodinCloud — Turning Ideas into Sophisticated Platforms
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, Clock, Zap, Star, Search, Filter, Grid, List,
  ChevronRight, Lock, CheckCircle, Play, Award, TrendingUp,
  Globe, Mic, MessageSquare, Lightbulb, Target, Crown, Diamond
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

// Level configurations with stunning colors
const levelConfigs: Record<string, {
  name: string;
  description: string;
  color: string;
  gradient: string;
  bgGradient: string;
  icon: string;
  lessons: number;
}> = {
  A1: {
    name: 'Beginner',
    description: 'Start your English journey',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-500/20 to-teal-600/10',
    icon: '🌱',
    lessons: 50,
  },
  A2: {
    name: 'Elementary',
    description: 'Build your foundation',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/20 to-indigo-600/10',
    icon: '📚',
    lessons: 50,
  },
  B1: {
    name: 'Intermediate',
    description: 'Expand your skills',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-500/20 to-purple-600/10',
    icon: '🚀',
    lessons: 50,
  },
  B2: {
    name: 'Upper Intermediate',
    description: 'Achieve fluency',
    color: '#f97316',
    gradient: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-500/20 to-amber-600/10',
    icon: '⭐',
    lessons: 50,
  },
  C1: {
    name: 'Advanced',
    description: 'Master the language',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-500/20 to-rose-600/10',
    icon: '💎',
    lessons: 50,
  },
  C2: {
    name: 'Mastery',
    description: 'Native-level proficiency',
    color: '#ffd700',
    gradient: 'from-yellow-400 to-amber-500',
    bgGradient: 'from-yellow-400/20 to-amber-500/10',
    icon: '👑',
    lessons: 51,
  },
};

// Category configurations
const categoryConfigs: Record<string, { icon: any; color: string; name: string }> = {
  daily_conversation: { icon: MessageSquare, color: '#3b82f6', name: 'Daily Conversation' },
  business: { icon: TrendingUp, color: '#10b981', name: 'Business English' },
  travel: { icon: Globe, color: '#f97316', name: 'Travel & Tourism' },
  academic: { icon: BookOpen, color: '#8b5cf6', name: 'Academic English' },
  social: { icon: Star, color: '#ec4899', name: 'Social Skills' },
  culture: { icon: Award, color: '#06b6d4', name: 'American Culture' },
  idioms: { icon: Lightbulb, color: '#ffd700', name: 'Idioms & Expressions' },
  pronunciation: { icon: Mic, color: '#ef4444', name: 'Pronunciation' },
};

// Sample course data
const sampleCourses = [
  { id: 'A1-U1', level: 'A1', unit: 1, title: 'Hello, America!', lessons: 10, duration: 120, progress: 80, category: 'daily_conversation' },
  { id: 'A1-U2', level: 'A1', unit: 2, title: 'Numbers & Time', lessons: 10, duration: 90, progress: 60, category: 'daily_conversation' },
  { id: 'A1-U3', level: 'A1', unit: 3, title: 'Family & Friends', lessons: 10, duration: 100, progress: 40, category: 'social' },
  { id: 'A1-U4', level: 'A1', unit: 4, title: 'Food & Dining', lessons: 10, duration: 110, progress: 20, category: 'culture' },
  { id: 'A1-U5', level: 'A1', unit: 5, title: 'Shopping Basics', lessons: 10, duration: 95, progress: 0, category: 'daily_conversation' },
  { id: 'A2-U1', level: 'A2', unit: 1, title: 'Travel Adventures', lessons: 10, duration: 130, progress: 100, category: 'travel' },
  { id: 'A2-U2', level: 'A2', unit: 2, title: 'Health & Wellness', lessons: 10, duration: 100, progress: 50, category: 'daily_conversation' },
  { id: 'B1-U1', level: 'B1', unit: 1, title: 'Business Meetings', lessons: 10, duration: 150, progress: 30, category: 'business' },
  { id: 'B1-U2', level: 'B1', unit: 2, title: 'Academic Writing', lessons: 10, duration: 140, progress: 0, category: 'academic' },
  { id: 'B2-U1', level: 'B2', unit: 1, title: 'Advanced Grammar', lessons: 10, duration: 160, progress: 0, category: 'academic' },
  { id: 'C1-U1', level: 'C1', unit: 1, title: 'Idiomatic Expressions', lessons: 10, duration: 180, progress: 0, category: 'idioms' },
  { id: 'C2-U1', level: 'C2', unit: 1, title: 'Native Fluency', lessons: 11, duration: 200, progress: 0, category: 'pronunciation' },
];

export default function CoursesGallery() {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter courses
  const filteredCourses = useMemo(() => {
    return sampleCourses.filter(course => {
      if (selectedLevel && course.level !== selectedLevel) return false;
      if (selectedCategory && course.category !== selectedCategory) return false;
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedLevel, selectedCategory, searchQuery]);

  // Calculate stats
  const totalLessons = 301;
  const completedLessons = sampleCourses.reduce((acc, c) => acc + Math.round(c.lessons * c.progress / 100), 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-12 px-4 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: Object.values(levelConfigs)[i % 6].color,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Badge 
                className="mb-4 px-4 py-2"
                style={{ background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#000' }}
              >
                <BookOpen className="w-4 h-4 mr-2 inline" />
                301 Lessons • A1-C2
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
                  American English
                </span>
                <br />
                <span className="text-white">Course Library</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Master American English with our comprehensive curriculum featuring 64 stunning host couples
              </p>
            </motion.div>

            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto mb-8"
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Overall Progress</span>
                    <span className="text-yellow-400 font-bold">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <div className="flex items-center justify-between mt-2 text-sm text-white/50">
                    <span>{completedLessons} lessons completed</span>
                    <span>{totalLessons - completedLessons} remaining</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Level Cards */}
        <section className="px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Level</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(levelConfigs).map(([level, config], idx) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                      selectedLevel === level 
                        ? 'ring-2 ring-offset-2 ring-offset-slate-950' 
                        : ''
                    }`}
                    style={{
                      borderColor: selectedLevel === level ? config.color : 'rgba(255,255,255,0.1)',
                      background: `linear-gradient(135deg, ${config.color}20, ${config.color}05)`,
                      boxShadow: selectedLevel === level ? `0 0 20px ${config.color}40` : 'none'
                    }}
                    onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                  >
                    <CardContent className="p-4 text-center">
                      <span className="text-3xl mb-2 block">{config.icon}</span>
                      <h3 
                        className="text-xl font-bold mb-1"
                        style={{ color: config.color }}
                      >
                        {level}
                      </h3>
                      <p className="text-sm text-white/70">{config.name}</p>
                      <p className="text-xs text-white/50 mt-1">{config.lessons} lessons</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryConfigs).slice(0, 4).map(([key, config]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    className={`${
                      selectedCategory === key 
                        ? 'bg-white/10 border-white/30' 
                        : 'border-white/10 text-white/70'
                    }`}
                    style={{
                      borderColor: selectedCategory === key ? config.color : undefined,
                      color: selectedCategory === key ? config.color : undefined
                    }}
                  >
                    <config.icon className="w-4 h-4 mr-2" />
                    {config.name}
                  </Button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'text-white' : 'text-white/50'}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'text-white' : 'text-white/50'}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Cards */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedLevel}-${selectedCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
                }
              >
                {filteredCourses.map((course, idx) => {
                  const levelConfig = levelConfigs[course.level];
                  const categoryConfig = categoryConfigs[course.category];
                  const isCompleted = course.progress === 100;
                  const isLocked = course.progress === 0 && idx > 4;

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link href={`/courses/${course.id}`}>
                        <Card
                          className={`group cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] ${
                            isLocked ? 'opacity-60' : ''
                          }`}
                          style={{
                            borderColor: `${levelConfig.color}30`,
                            background: `linear-gradient(135deg, ${levelConfig.color}10, transparent)`
                          }}
                        >
                          {/* Card header with gradient */}
                          <div 
                            className="h-24 relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${levelConfig.color}40, ${levelConfig.color}20)`
                            }}
                          >
                            {/* Level badge */}
                            <Badge 
                              className="absolute top-3 left-3 font-bold"
                              style={{ 
                                background: levelConfig.color,
                                color: '#000'
                              }}
                            >
                              {course.level}
                            </Badge>

                            {/* Status badge */}
                            {isCompleted && (
                              <Badge className="absolute top-3 right-3 bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complete
                              </Badge>
                            )}
                            {isLocked && (
                              <Badge className="absolute top-3 right-3 bg-white/20">
                                <Lock className="w-3 h-3 mr-1" />
                                Locked
                              </Badge>
                            )}

                            {/* Unit number */}
                            <div className="absolute bottom-3 right-3 text-4xl font-bold text-white/20">
                              U{course.unit}
                            </div>
                          </div>

                          <CardContent className="p-4">
                            {/* Title */}
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                              {course.title}
                            </h3>

                            {/* Category */}
                            <div className="flex items-center gap-2 mb-3">
                              <categoryConfig.icon 
                                className="w-4 h-4" 
                                style={{ color: categoryConfig.color }}
                              />
                              <span className="text-sm text-white/60">{categoryConfig.name}</span>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-white/50 mb-3">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {course.lessons} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration} min
                              </span>
                            </div>

                            {/* Progress */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-white/50">Progress</span>
                                <span style={{ color: levelConfig.color }}>{course.progress}%</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: levelConfig.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${course.progress}%` }}
                                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                                />
                              </div>
                            </div>

                            {/* CTA */}
                            <Button
                              className="w-full mt-4 group-hover:opacity-100 opacity-80 transition-opacity"
                              style={{
                                background: `linear-gradient(135deg, ${levelConfig.color}, ${levelConfig.color}cc)`,
                                color: '#000'
                              }}
                              disabled={isLocked}
                            >
                              {isLocked ? (
                                <>
                                  <Lock className="w-4 h-4 mr-2" />
                                  Unlock
                                </>
                              ) : isCompleted ? (
                                <>
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Review
                                </>
                              ) : course.progress > 0 ? (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Continue
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-white/20 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
                <p className="text-white/50">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/50 text-sm">
              Marketed by <span className="text-yellow-400">CodinCloud</span> — Turning Ideas into Sophisticated Platforms
            </p>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}

// Re-export for backwards compatibility
const RotateCcw = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 4v6h6M23 20v-6h-6" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);
