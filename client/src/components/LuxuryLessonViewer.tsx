/**
 * LuxuryLessonViewer - Stunning Premium Lesson Display Component
 * Prize2Pride American English Learning Platform
 * 
 * Features:
 * - Luxurious dark theme with gold & diamond accents
 * - Colorful content presentation with syntax highlighting
 * - Host couple avatar display with animations
 * - TTS audio integration with visual waveform
 * - Progress tracking and XP display
 * - Bilingual EN/AR support with RTL
 * - Comfortable autonomous learning features
 * 
 * Marketed by CodinCloud — Turning Ideas into Sophisticated Platforms
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  RotateCcw, ChevronLeft, ChevronRight, BookOpen, Target,
  Lightbulb, Globe, CheckCircle, Loader2, Clock, Zap, Award,
  MessageSquare, Mic, Headphones, Sparkles, GraduationCap,
  Settings, X, Maximize2, Minimize2, Crown, Diamond, Star,
  Heart, Share2, Download, Bookmark, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Level color configurations with luxurious gradients
const levelColors: Record<string, {
  primary: string;
  secondary: string;
  gradient: string;
  glow: string;
  badge: string;
}> = {
  A1: { 
    primary: '#10b981', 
    secondary: '#059669', 
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    glow: 'shadow-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  A2: { 
    primary: '#3b82f6', 
    secondary: '#2563eb', 
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    glow: 'shadow-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  B1: { 
    primary: '#8b5cf6', 
    secondary: '#7c3aed', 
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    glow: 'shadow-violet-500/30',
    badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30'
  },
  B2: { 
    primary: '#f97316', 
    secondary: '#ea580c', 
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    glow: 'shadow-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  },
  C1: { 
    primary: '#ec4899', 
    secondary: '#db2777', 
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    glow: 'shadow-pink-500/30',
    badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  },
  C2: { 
    primary: '#ffd700', 
    secondary: '#f59e0b', 
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  },
};

// Content section types with colors
const sectionColors: Record<string, { icon: any; color: string; bg: string }> = {
  grammar: { icon: BookOpen, color: '#3b82f6', bg: 'bg-blue-500/10' },
  vocabulary: { icon: Target, color: '#10b981', bg: 'bg-emerald-500/10' },
  pronunciation: { icon: Mic, color: '#f97316', bg: 'bg-orange-500/10' },
  listening: { icon: Headphones, color: '#8b5cf6', bg: 'bg-violet-500/10' },
  speaking: { icon: MessageSquare, color: '#ec4899', bg: 'bg-pink-500/10' },
  culture: { icon: Globe, color: '#06b6d4', bg: 'bg-cyan-500/10' },
  tips: { icon: Lightbulb, color: '#ffd700', bg: 'bg-yellow-500/10' },
};

interface LuxuryLessonViewerProps {
  lessonId: string;
  lessonData: {
    id: string;
    level: string;
    title: string;
    subtitle?: string;
    duration: number;
    xpReward: number;
    avatarId?: string;
    avatarImageUrl?: string;
    category: string;
    objectives: string[];
    objectivesArabic?: string;
    content: string;
    culturalNotes?: string;
    vocabulary?: Array<{
      word: string;
      definition: string;
      example: string;
      translation?: string;
    }>;
  };
  onComplete?: () => void;
  onClose?: () => void;
  hostCoupleImage?: string;
}

export default function LuxuryLessonViewer({
  lessonId,
  lessonData,
  onComplete,
  onClose,
  hostCoupleImage
}: LuxuryLessonViewerProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [highlightedSentence, setHighlightedSentence] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Get level colors
  const levelConfig = levelColors[lessonData.level] || levelColors.A1;
  
  // Parse content into sections
  const contentSections = lessonData.content.split(/<hr\s*\/?>/gi).filter(Boolean);
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle audio controls
  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Navigate sections
  const goToNextSection = () => {
    if (currentSection < contentSections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setProgress(((currentSection + 1) / contentSections.length) * 100);
    } else {
      // Lesson complete
      onComplete?.();
      toast.success('🎉 Lesson Complete!', {
        description: `You earned ${lessonData.xpReward} XP!`
      });
    }
  };
  
  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setProgress(((currentSection - 1) / contentSections.length) * 100);
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextSection();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSection();
      } else if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection]);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden ${isFullscreen ? '' : 'p-4 md:p-8'}`}
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? '#ffd700' : levelConfig.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className={`relative h-full flex flex-col ${isFullscreen ? '' : 'rounded-2xl overflow-hidden'}`}>
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 px-6 py-4 flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Level badge */}
            <Badge 
              className={`px-3 py-1 text-sm font-bold ${levelConfig.badge}`}
            >
              {lessonData.level}
            </Badge>
            
            {/* Title */}
            <div>
              <h1 className="text-xl font-bold text-white line-clamp-1">
                {lessonData.title}
              </h1>
              {lessonData.subtitle && (
                <p className="text-sm text-white/60">{lessonData.subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Header actions */}
          <div className="flex items-center gap-2">
            {/* XP Badge */}
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              +{lessonData.xpReward} XP
            </Badge>
            
            {/* Duration */}
            <Badge className="bg-white/10 text-white/70 border-white/20 px-3 py-1">
              <Clock className="w-4 h-4 mr-1" />
              {lessonData.duration} min
            </Badge>
            
            {/* Bookmark */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`${isBookmarked ? 'text-yellow-400' : 'text-white/50'} hover:text-yellow-400`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            
            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white/50 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white/50 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          </div>
        </motion.header>

        {/* Progress bar */}
        <div className="relative h-1 bg-white/10">
          <motion.div
            className="absolute h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${levelConfig.primary}, ${levelConfig.secondary})`,
              boxShadow: `0 0 10px ${levelConfig.primary}60`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left side - Host couple avatar */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex w-80 flex-col items-center justify-center p-6"
            style={{
              background: 'linear-gradient(180deg, rgba(255,215,0,0.05) 0%, rgba(0,0,0,0.3) 100%)'
            }}
          >
            {/* Host couple image */}
            <div className="relative mb-6">
              <div 
                className="w-48 h-48 rounded-full overflow-hidden border-4"
                style={{ 
                  borderColor: levelConfig.primary,
                  boxShadow: `0 0 30px ${levelConfig.primary}40`
                }}
              >
                {hostCoupleImage ? (
                  <img 
                    src={hostCoupleImage} 
                    alt="Host Couple"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${levelConfig.primary}40, ${levelConfig.secondary}40)` }}
                  >
                    <GraduationCap className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>
              
              {/* Speaking indicator */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-green-500"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-xs text-white font-medium">Speaking</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Host info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-1">Your Host</h3>
              <p className="text-sm text-white/60">Prize2Pride Instructor</p>
            </div>
            
            {/* Audio waveform visualization */}
            <div className="mt-6 flex items-center justify-center gap-1 h-12">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: levelConfig.primary }}
                  animate={{
                    height: isPlaying ? [8, 24 + Math.random() * 16, 8] : 8,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Center - Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl mx-auto"
                >
                  {/* Section indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <Badge className="bg-white/10 text-white/70">
                      Section {currentSection + 1} of {contentSections.length}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {contentSections.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSection(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentSection 
                              ? 'w-6' 
                              : idx < currentSection 
                                ? 'bg-green-500' 
                                : 'bg-white/20'
                          }`}
                          style={{
                            background: idx === currentSection ? levelConfig.primary : undefined
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content card */}
                  <Card 
                    className="overflow-hidden border-2"
                    style={{
                      borderColor: `${levelConfig.primary}30`,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                    }}
                  >
                    <CardContent className="p-6 md:p-8">
                      {/* Render HTML content with enhanced styling */}
                      <div 
                        className="prose prose-invert prose-lg max-w-none
                          prose-headings:text-white prose-headings:font-bold
                          prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-0
                          prose-h3:text-xl prose-h3:mb-3
                          prose-p:text-white/80 prose-p:leading-relaxed
                          prose-li:text-white/80
                          prose-strong:text-white
                          prose-em:text-white/90
                          prose-ul:space-y-2
                          [&_span[style*='color:#154360']]:text-cyan-400
                          [&_span[style*='color:#8b0000']]:text-rose-400
                        "
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                        dangerouslySetInnerHTML={{ 
                          __html: contentSections[currentSection] || '' 
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Vocabulary section (if available) */}
                  {lessonData.vocabulary && lessonData.vocabulary.length > 0 && currentSection === contentSections.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6"
                    >
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-400" />
                        Key Vocabulary
                      </h3>
                      <div className="grid gap-3">
                        {lessonData.vocabulary.slice(0, 5).map((vocab, idx) => (
                          <Card 
                            key={idx}
                            className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-lg font-semibold text-white">{vocab.word}</p>
                                  <p className="text-sm text-white/60">{vocab.definition}</p>
                                  <p className="text-sm text-white/40 italic mt-1">"{vocab.example}"</p>
                                </div>
                                {vocab.translation && showTranslation && (
                                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                    {vocab.translation}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Audio controls */}
            <div 
              className="p-4 border-t border-white/10"
              style={{
                background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)'
              }}
            >
              <div className="max-w-3xl mx-auto">
                {/* Progress slider */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-white/50 w-10">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={(v) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = v[0];
                        setCurrentTime(v[0]);
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs text-white/50 w-10">{formatTime(duration)}</span>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  {/* Left controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white/70 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>

                  {/* Center controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevSection}
                      disabled={currentSection === 0}
                      className="text-white/70 hover:text-white disabled:opacity-30"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    
                    <Button
                      size="lg"
                      onClick={togglePlay}
                      className="w-14 h-14 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${levelConfig.primary}, ${levelConfig.secondary})`,
                        boxShadow: `0 0 20px ${levelConfig.primary}40`
                      }}
                    >
                      {audioLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNextSection}
                      className="text-white/70 hover:text-white"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-2">
                    {/* Playback speed */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                        const currentIndex = speeds.indexOf(playbackSpeed);
                        const nextIndex = (currentIndex + 1) % speeds.length;
                        setPlaybackSpeed(speeds[nextIndex]);
                        if (audioRef.current) {
                          audioRef.current.playbackRate = speeds[nextIndex];
                        }
                      }}
                      className="text-white/70 hover:text-white px-2"
                    >
                      {playbackSpeed}x
                    </Button>
                    
                    {/* Translation toggle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowTranslation(!showTranslation)}
                      className={`${showTranslation ? 'text-cyan-400' : 'text-white/50'} hover:text-cyan-400`}
                    >
                      <Globe className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Learning objectives */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden xl:block w-80 p-6 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(255,215,0,0.05) 100%)'
            }}
          >
            {/* Learning objectives */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Learning Objectives
              </h3>
              <div className="space-y-3">
                {lessonData.objectives.map((objective, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <CheckCircle 
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        idx <= currentSection ? 'text-green-400' : 'text-white/30'
                      }`}
                    />
                    <p 
                      className="text-sm text-white/80"
                      dangerouslySetInnerHTML={{ __html: objective }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cultural notes */}
            {lessonData.culturalNotes && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Cultural Notes
                </h3>
                <Card className="bg-cyan-500/10 border-cyan-500/30">
                  <CardContent className="p-4">
                    <div 
                      className="text-sm text-white/80 prose prose-invert prose-sm"
                      dangerouslySetInnerHTML={{ __html: lessonData.culturalNotes }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 p-6 overflow-y-auto z-20"
              style={{
                background: 'linear-gradient(135deg, rgba(26,26,46,0.98) 0%, rgba(15,15,35,0.98) 100%)',
                borderLeft: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Settings</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Auto-play */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Auto-play</p>
                    <p className="text-xs text-white/50">Automatically advance sections</p>
                  </div>
                  <Switch
                    checked={autoPlay}
                    onCheckedChange={setAutoPlay}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>

                {/* Show translations */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Arabic Translations</p>
                    <p className="text-xs text-white/50">Show bilingual content</p>
                  </div>
                  <Switch
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                    className="data-[state=checked]:bg-cyan-500"
                  />
                </div>

                {/* Playback speed */}
                <div>
                  <p className="text-white font-medium mb-2">Playback Speed</p>
                  <div className="flex gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <Button
                        key={speed}
                        variant="outline"
                        size="sm"
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`flex-1 ${
                          playbackSpeed === speed 
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                            : 'border-white/20 text-white/70'
                        }`}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
