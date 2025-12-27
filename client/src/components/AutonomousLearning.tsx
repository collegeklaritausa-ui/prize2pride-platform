/**
 * AutonomousLearning - Smart Learning Features Component
 * Prize2Pride American English Learning Platform
 * 
 * Features:
 * - Usage tracking and daily limits display
 * - Smart lesson recommendations
 * - Learning streak tracking
 * - Progress visualization
 * - Comfortable auto-play mode
 * - Spaced repetition reminders
 * 
 * Marketed by CodinCloud — Turning Ideas into Sophisticated Platforms
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Zap, Target, TrendingUp, Award, BookOpen, 
  Play, Pause, SkipForward, Volume2, Settings, 
  Calendar, Flame, Star, CheckCircle, AlertCircle,
  Crown, Diamond, Sparkles, ArrowRight, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface AutonomousLearningProps {
  userId?: number;
  onStartLesson?: (lessonId: string) => void;
  onUpgrade?: () => void;
}

// Subscription tier colors
const tierColors: Record<string, { primary: string; gradient: string; icon: any }> = {
  freemium: { primary: '#6b7280', gradient: 'from-gray-500 to-gray-600', icon: Star },
  bronze: { primary: '#cd7f32', gradient: 'from-amber-700 to-amber-800', icon: Award },
  silver: { primary: '#c0c0c0', gradient: 'from-slate-400 to-slate-500', icon: Star },
  gold: { primary: '#ffd700', gradient: 'from-yellow-500 to-amber-500', icon: Crown },
  diamond: { primary: '#b9f2ff', gradient: 'from-cyan-400 to-blue-500', icon: Diamond },
  vip_millionaire: { primary: '#ff00ff', gradient: 'from-purple-500 to-pink-500', icon: Sparkles },
};

export default function AutonomousLearning({
  userId,
  onStartLesson,
  onUpgrade
}: AutonomousLearningProps) {
  // Settings state
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [autoAdvanceDelay, setAutoAdvanceDelay] = useState(3); // seconds
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [showTranslations, setShowTranslations] = useState(true);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);

  // Mock subscription data (would come from API)
  const [subscriptionData, setSubscriptionData] = useState({
    tier: 'freemium',
    dailyLimitMinutes: 60,
    usedMinutesToday: 25,
    remainingMinutes: 35,
    isUnlimited: false,
    streak: 7,
    totalXp: 1250,
    level: 3,
    lessonsCompleted: 15,
    vocabularyMastered: 120,
  });

  // Calculate usage percentage
  const usagePercentage = subscriptionData.isUnlimited 
    ? 0 
    : (subscriptionData.usedMinutesToday / subscriptionData.dailyLimitMinutes) * 100;

  const tierConfig = tierColors[subscriptionData.tier] || tierColors.freemium;
  const TierIcon = tierConfig.icon;

  // Format time display
  const formatMinutes = (minutes: number): string => {
    if (minutes < 0) return 'Unlimited';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Recommended lessons (mock data)
  const recommendedLessons = [
    { id: 'A1-U1-L2', title: 'Numbers & Counting', level: 'A1', duration: 15, xp: 50 },
    { id: 'A1-U1-L3', title: 'Basic Greetings', level: 'A1', duration: 20, xp: 60 },
    { id: 'A1-U2-L1', title: 'Family Members', level: 'A1', duration: 25, xp: 75 },
  ];

  // Vocabulary due for review
  const vocabularyDue = [
    { word: 'Hello', mastery: 80 },
    { word: 'Thank you', mastery: 65 },
    { word: 'Please', mastery: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Usage & Subscription Status */}
      <Card 
        className="overflow-hidden border-2"
        style={{ 
          borderColor: `${tierConfig.primary}40`,
          background: 'linear-gradient(135deg, rgba(15,15,35,0.95), rgba(26,26,46,0.9))'
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-white">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${tierConfig.primary}40, ${tierConfig.primary}20)` }}
              >
                <TierIcon className="w-5 h-5" style={{ color: tierConfig.primary }} />
              </div>
              <div>
                <span className="capitalize">{subscriptionData.tier.replace('_', ' ')}</span>
                <p className="text-sm text-white/60 font-normal">Subscription</p>
              </div>
            </CardTitle>
            {!subscriptionData.isUnlimited && (
              <Button
                variant="outline"
                size="sm"
                onClick={onUpgrade}
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Daily Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Today's Learning Time
              </span>
              <span className="text-sm font-medium" style={{ color: tierConfig.primary }}>
                {formatMinutes(subscriptionData.usedMinutesToday)} / {formatMinutes(subscriptionData.dailyLimitMinutes)}
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${tierConfig.primary}, ${tierConfig.primary}cc)`,
                  width: `${Math.min(usagePercentage, 100)}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            {usagePercentage >= 80 && !subscriptionData.isUnlimited && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-amber-400 mt-2 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                Running low on daily time. Consider upgrading!
              </motion.p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Flame, label: 'Streak', value: `${subscriptionData.streak} days`, color: '#f97316' },
              { icon: Zap, label: 'Total XP', value: subscriptionData.totalXp.toLocaleString(), color: '#ffd700' },
              { icon: BookOpen, label: 'Lessons', value: subscriptionData.lessonsCompleted, color: '#3b82f6' },
              { icon: Target, label: 'Words', value: subscriptionData.vocabularyMastered, color: '#10b981' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-3 rounded-lg bg-white/5"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-1" style={{ color: stat.color }} />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Settings */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Settings className="w-5 h-5 text-blue-400" />
            Autonomous Learning Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-Play Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Auto-Play Lessons</p>
              <p className="text-sm text-white/50">Automatically advance through content</p>
            </div>
            <Switch
              checked={autoPlayEnabled}
              onCheckedChange={setAutoPlayEnabled}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {/* Auto-Advance Delay */}
          {autoPlayEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70">Advance Delay</p>
                <span className="text-sm text-white">{autoAdvanceDelay}s</span>
              </div>
              <Slider
                value={[autoAdvanceDelay]}
                min={1}
                max={10}
                step={1}
                onValueChange={(v) => setAutoAdvanceDelay(v[0])}
                className="w-full"
              />
            </motion.div>
          )}

          {/* Voice Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-green-400" />
                Voice Speed
              </p>
              <span className="text-sm text-white">{voiceSpeed}x</span>
            </div>
            <Slider
              value={[voiceSpeed]}
              min={0.5}
              max={2}
              step={0.25}
              onValueChange={(v) => setVoiceSpeed(v[0])}
              className="w-full"
            />
          </div>

          {/* Show Translations */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Show Arabic Translations</p>
              <p className="text-sm text-white/50">Display bilingual content</p>
            </div>
            <Switch
              checked={showTranslations}
              onCheckedChange={setShowTranslations}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Daily Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Daily Goal
              </p>
              <span className="text-sm text-white">{dailyGoalMinutes} min</span>
            </div>
            <Slider
              value={[dailyGoalMinutes]}
              min={10}
              max={120}
              step={10}
              onValueChange={(v) => setDailyGoalMinutes(v[0])}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommended Lessons */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendedLessons.map((lesson, idx) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              onClick={() => onStartLesson?.(lesson.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{lesson.title}</p>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-xs">
                      {lesson.level}
                    </Badge>
                    <span>{lesson.duration} min</span>
                    <span className="text-yellow-400">+{lesson.xp} XP</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Vocabulary Review */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              Words to Review
            </CardTitle>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              {vocabularyDue.length} due
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vocabularyDue.map((vocab, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5"
              >
                <span className="text-white">{vocab.word}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${vocab.mastery}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/50">{vocab.mastery}%</span>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Start Review Session
          </Button>
        </CardContent>
      </Card>

      {/* Daily Progress */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Calendar className="w-5 h-5 text-violet-400" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Learning Time', current: subscriptionData.usedMinutesToday, goal: dailyGoalMinutes, unit: 'min', color: '#3b82f6' },
              { label: 'XP Earned', current: 75, goal: 100, unit: 'XP', color: '#ffd700' },
              { label: 'Lessons', current: 2, goal: 3, unit: '', color: '#10b981' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{item.label}</span>
                  <span className="text-white">
                    {item.current}{item.unit} / {item.goal}{item.unit}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: item.color,
                      width: `${Math.min((item.current / item.goal) * 100, 100)}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.current / item.goal) * 100, 100)}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Completion Badge */}
          <AnimatePresence>
            {subscriptionData.usedMinutesToday >= dailyGoalMinutes && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center"
              >
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-medium">Daily Goal Achieved!</p>
                <p className="text-xs text-white/50">Keep up the great work!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
