/**
 * Prize2Pride - AMOS Lesson Modal
 * Hyper-Realistic Video Generation Display
 * 
 * Full-screen modal for lesson content with:
 * - Animated host couple display
 * - Synchronized subtitles with highlighting
 * - Casino-show studio atmosphere
 * - Gold & Diamond branding
 * - TTS-1-HD Nova voice playback
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Settings, Maximize2, Minimize2, ChevronLeft, ChevronRight,
  Star, Trophy, Sparkles, Crown, Gem
} from 'lucide-react';
import { AmosOutput, SubtitleSegment, StudioTheme } from '@/hooks/useAmosLessonTrigger';

interface AmosLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonLevel: string;
  amosOutput: AmosOutput | null;
  isLoading: boolean;
}

export function AmosLessonModal({
  isOpen,
  onClose,
  lessonTitle,
  lessonLevel,
  amosOutput,
  isLoading,
}: AmosLessonModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [avatarExpression, setAvatarExpression] = useState<'neutral' | 'speaking' | 'happy'>('neutral');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Theme from AMOS output or default casino-gold
  const theme: StudioTheme = amosOutput?.theme || {
    backgroundColor: '#0a0a1a',
    accentColor: '#ffd700',
    brandColor: '#ffd700',
    textColor: '#ffffff',
    highlightColor: '#ffed4e',
    gradientStart: '#1a1a2e',
    gradientEnd: '#0a0a1a',
  };

  // Level color mapping
  const levelColors: Record<string, string> = {
    'A1': '#22c55e',
    'A2': '#84cc16',
    'B1': '#eab308',
    'B2': '#f97316',
    'C1': '#ef4444',
    'C2': '#a855f7',
  };

  // Auto-advance subtitles during playback
  useEffect(() => {
    if (isPlaying && amosOutput?.subtitles) {
      subtitleTimerRef.current = setInterval(() => {
        setCurrentSubtitleIndex(prev => {
          if (prev < amosOutput.subtitles.length - 1) {
            return prev + 1;
          }
          setIsPlaying(false);
          return prev;
        });
        // Animate avatar expression
        setAvatarExpression(prev => prev === 'speaking' ? 'happy' : 'speaking');
      }, 4000 / playbackSpeed);
    }

    return () => {
      if (subtitleTimerRef.current) {
        clearInterval(subtitleTimerRef.current);
      }
    };
  }, [isPlaying, amosOutput, playbackSpeed]);

  // Handle play/pause
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isPlaying]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Navigate subtitles
  const goToPrevSubtitle = useCallback(() => {
    setCurrentSubtitleIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextSubtitle = useCallback(() => {
    if (amosOutput) {
      setCurrentSubtitleIndex(prev => Math.min(amosOutput.subtitles.length - 1, prev + 1));
    }
  }, [amosOutput]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayback();
          break;
        case 'ArrowLeft':
          goToPrevSubtitle();
          break;
        case 'ArrowRight':
          goToNextSubtitle();
          break;
        case 'Escape':
          onClose();
          break;
        case 'm':
          setIsMuted(prev => !prev);
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePlayback, goToPrevSubtitle, goToNextSubtitle, onClose, toggleFullscreen]);

  if (!isOpen) return null;

  const currentSubtitle = amosOutput?.subtitles[currentSubtitleIndex];
  const progress = amosOutput ? ((currentSubtitleIndex + 1) / amosOutput.subtitles.length) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accentColor, opacity: 0.3 }}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * -200],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Top branding bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <Crown className="w-8 h-8" style={{ color: theme.accentColor }} />
              <span 
                className="text-2xl font-bold tracking-wider"
                style={{ 
                  color: theme.accentColor,
                  textShadow: `0 0 20px ${theme.accentColor}40`,
                }}
              >
                Prize2Pride
              </span>
            </motion.div>
            <div 
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ 
                backgroundColor: levelColors[lessonLevel] || '#ffd700',
                color: '#000',
              }}
            >
              {lessonLevel}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full"
              style={{ backgroundColor: `${theme.accentColor}20` }}
            >
              <Settings className="w-5 h-5" style={{ color: theme.textColor }} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="p-2 rounded-full"
              style={{ backgroundColor: `${theme.accentColor}20` }}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" style={{ color: theme.textColor }} />
              ) : (
                <Maximize2 className="w-5 h-5" style={{ color: theme.textColor }} />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-full"
              style={{ backgroundColor: `${theme.accentColor}20` }}
            >
              <X className="w-6 h-6" style={{ color: theme.textColor }} />
            </motion.button>
          </div>
        </div>

        {/* Main content area */}
        <div className="w-full max-w-6xl mx-auto px-8 pt-20 pb-32">
          {isLoading ? (
            <LoadingAnimation theme={theme} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Host couple avatar section */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="relative"
                >
                  {/* Avatar container with glow effect */}
                  <div 
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: `0 0 60px ${theme.accentColor}40`,
                      border: `2px solid ${theme.accentColor}`,
                    }}
                  >
                    {/* Avatar image placeholder */}
                    <div 
                      className="aspect-[3/4] flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(180deg, ${theme.gradientStart} 0%, ${theme.backgroundColor} 100%)`,
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: avatarExpression === 'speaking' ? [1, 1.02, 1] : 1,
                        }}
                        transition={{ duration: 0.5, repeat: avatarExpression === 'speaking' ? Infinity : 0 }}
                        className="text-center"
                      >
                        <div 
                          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4"
                          style={{ 
                            backgroundColor: `${theme.accentColor}20`,
                            border: `3px solid ${theme.accentColor}`,
                          }}
                        >
                          <Sparkles className="w-16 h-16" style={{ color: theme.accentColor }} />
                        </div>
                        <p className="text-lg font-semibold" style={{ color: theme.textColor }}>
                          {amosOutput?.avatarAnimationData.avatarId || 'Nova & Alex'}
                        </p>
                        <p className="text-sm opacity-70" style={{ color: theme.textColor }}>
                          Your AI Language Guides
                        </p>
                      </motion.div>
                    </div>

                    {/* Speaking indicator */}
                    {isPlaying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-1"
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full"
                            style={{ backgroundColor: theme.accentColor }}
                            animate={{
                              height: [8, 24, 8],
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Host info card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-4 rounded-xl"
                    style={{ 
                      backgroundColor: `${theme.accentColor}10`,
                      border: `1px solid ${theme.accentColor}30`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Gem className="w-5 h-5" style={{ color: theme.accentColor }} />
                      <span className="font-semibold" style={{ color: theme.accentColor }}>
                        Casino-Show Studio
                      </span>
                    </div>
                    <p className="text-sm opacity-80" style={{ color: theme.textColor }}>
                      Experience luxury learning with our Gold & Diamond hosts
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* Lesson content section */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Lesson title */}
                  <h1 
                    className="text-3xl lg:text-4xl font-bold mb-6"
                    style={{ 
                      color: theme.textColor,
                      textShadow: `0 0 30px ${theme.accentColor}30`,
                    }}
                  >
                    {lessonTitle}
                  </h1>

                  {/* Subtitle display area */}
                  <div 
                    className="relative p-8 rounded-2xl min-h-[300px] flex flex-col justify-center"
                    style={{
                      backgroundColor: `${theme.backgroundColor}cc`,
                      border: `2px solid ${theme.accentColor}40`,
                      boxShadow: `inset 0 0 60px ${theme.accentColor}10`,
                    }}
                  >
                    {/* Current subtitle */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSubtitleIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                      >
                        <p 
                          className="text-2xl lg:text-3xl font-medium leading-relaxed"
                          style={{ color: theme.textColor }}
                        >
                          {currentSubtitle?.text || 'Click play to begin the lesson...'}
                        </p>
                        {currentSubtitle?.textAr && (
                          <p 
                            className="text-xl mt-4 opacity-70"
                            style={{ color: theme.textColor }}
                            dir="rtl"
                          >
                            {currentSubtitle.textAr}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Subtitle navigation dots */}
                    {amosOutput && (
                      <div className="flex justify-center gap-2 mt-8">
                        {amosOutput.subtitles.slice(
                          Math.max(0, currentSubtitleIndex - 3),
                          Math.min(amosOutput.subtitles.length, currentSubtitleIndex + 4)
                        ).map((_, i) => {
                          const actualIndex = Math.max(0, currentSubtitleIndex - 3) + i;
                          return (
                            <motion.button
                              key={actualIndex}
                              onClick={() => setCurrentSubtitleIndex(actualIndex)}
                              className="w-2 h-2 rounded-full transition-all"
                              style={{
                                backgroundColor: actualIndex === currentSubtitleIndex 
                                  ? theme.accentColor 
                                  : `${theme.textColor}40`,
                                transform: actualIndex === currentSubtitleIndex ? 'scale(1.5)' : 'scale(1)',
                              }}
                              whileHover={{ scale: 1.3 }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2" style={{ color: theme.textColor }}>
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: `${theme.textColor}20` }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom control bar */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-6"
          style={{
            background: `linear-gradient(transparent, ${theme.backgroundColor})`,
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div 
              className="flex items-center justify-center gap-4 p-4 rounded-2xl"
              style={{
                backgroundColor: `${theme.backgroundColor}ee`,
                border: `1px solid ${theme.accentColor}40`,
                boxShadow: `0 -10px 40px ${theme.backgroundColor}`,
              }}
            >
              {/* Previous button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPrevSubtitle}
                className="p-3 rounded-full"
                style={{ backgroundColor: `${theme.accentColor}20` }}
                disabled={currentSubtitleIndex === 0}
              >
                <SkipBack className="w-5 h-5" style={{ color: theme.textColor }} />
              </motion.button>

              {/* Play/Pause button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayback}
                className="p-5 rounded-full"
                style={{ 
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 0 30px ${theme.accentColor}60`,
                }}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" style={{ color: theme.backgroundColor }} />
                ) : (
                  <Play className="w-8 h-8 ml-1" style={{ color: theme.backgroundColor }} />
                )}
              </motion.button>

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextSubtitle}
                className="p-3 rounded-full"
                style={{ backgroundColor: `${theme.accentColor}20` }}
                disabled={!amosOutput || currentSubtitleIndex === amosOutput.subtitles.length - 1}
              >
                <SkipForward className="w-5 h-5" style={{ color: theme.textColor }} />
              </motion.button>

              {/* Volume button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full ml-4"
                style={{ backgroundColor: `${theme.accentColor}20` }}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" style={{ color: theme.textColor }} />
                ) : (
                  <Volume2 className="w-5 h-5" style={{ color: theme.textColor }} />
                )}
              </motion.button>

              {/* Speed selector */}
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="ml-4 px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: `${theme.accentColor}20`,
                  color: theme.textColor,
                  border: `1px solid ${theme.accentColor}40`,
                }}
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="flex justify-center gap-6 mt-4 text-xs opacity-50" style={{ color: theme.textColor }}>
              <span>Space: Play/Pause</span>
              <span>←→: Navigate</span>
              <span>M: Mute</span>
              <span>F: Fullscreen</span>
              <span>Esc: Close</span>
            </div>
          </div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-20 right-4 w-72 p-4 rounded-xl"
              style={{
                backgroundColor: theme.backgroundColor,
                border: `1px solid ${theme.accentColor}40`,
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: theme.textColor }}>
                Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm opacity-70" style={{ color: theme.textColor }}>
                    Voice
                  </label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: `${theme.accentColor}20`,
                      color: theme.textColor,
                      border: `1px solid ${theme.accentColor}40`,
                    }}
                  >
                    <option>TTS-1-HD Nova (American English)</option>
                    <option>TTS-1-HD Alloy</option>
                    <option>TTS-1-HD Echo</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm opacity-70" style={{ color: theme.textColor }}>
                    Subtitle Size
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="32"
                    defaultValue="24"
                    className="w-full mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: theme.textColor }}>
                    Show Arabic Translation
                  </span>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={amosOutput?.audioUrl} muted={isMuted} />
      </motion.div>
    </AnimatePresence>
  );
}

// Loading animation component
function LoadingAnimation({ theme }: { theme: StudioTheme }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 rounded-full border-4 border-t-transparent"
        style={{ borderColor: `${theme.accentColor} transparent ${theme.accentColor} ${theme.accentColor}` }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-6 text-xl font-medium"
        style={{ color: theme.textColor }}
      >
        Generating hyper-realistic lesson...
      </motion.p>
      <p className="mt-2 text-sm opacity-60" style={{ color: theme.textColor }}>
        Preparing TTS-1-HD Nova voice synthesis
      </p>
    </div>
  );
}

export default AmosLessonModal;
