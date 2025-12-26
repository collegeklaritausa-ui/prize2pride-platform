/**
 * AMOS Player - Autonomous Multimedia Orchestration System
 * Prize2Pride Platform - ARCHITECT_GENESIS_SUPREME Protocol
 * 
 * Renders hyper-realistic animated host video with synchronized voice,
 * color-coded subtitles, and luxurious course interface.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface AmosPlayerProps {
  videoUrl: string;
  audioUrl: string;
  subtitles: SubtitleSegment[];
  lessonTitle: string;
  lessonLevel: string;
  avatarName: string;
  themeConfig: ThemeConfig;
  onClose: () => void;
}

interface SubtitleSegment {
  startTime: number;
  endTime: number;
  text: string;
  language: 'en' | 'ar';
  highlightColor: string;
}

interface ThemeConfig {
  backgroundColor: string;
  accentColor: string;
  brandColor: string;
  textColor: string;
  highlightColor: string;
}

const levelColors: Record<string, string> = {
  A1: '#10b981',
  A2: '#3b82f6',
  B1: '#8b5cf6',
  B2: '#f97316',
  C1: '#ef4444',
  C2: '#eab308'
};

export default function AmosPlayer({
  videoUrl,
  audioUrl,
  subtitles,
  lessonTitle,
  lessonLevel,
  avatarName,
  themeConfig,
  onClose
}: AmosPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleSegment | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update current subtitle based on playback time
  useEffect(() => {
    const current = subtitles.find(
      sub => currentTime >= sub.startTime && currentTime < sub.endTime
    );
    setCurrentSubtitle(current || null);
  }, [currentTime, subtitles]);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Playback error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle fullscreen
  useEffect(() => {
    if (isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isFullscreen ? 'bg-black' : 'bg-black/80'
      }`}
      style={{ backgroundColor: isFullscreen ? '#000' : 'rgba(0,0,0,0.8)' }}
    >
      <div
        className={`w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl ${
          isFullscreen ? '' : 'max-w-6xl max-h-[90vh]'
        }`}
        style={{
          backgroundColor: themeConfig.backgroundColor,
          borderColor: themeConfig.accentColor,
          borderWidth: isFullscreen ? 0 : 2
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: themeConfig.accentColor }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles
                className="w-6 h-6"
                style={{ color: themeConfig.brandColor }}
              />
            </motion.div>
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: themeConfig.brandColor }}
              >
                {lessonTitle}
              </h2>
              <p style={{ color: themeConfig.textColor }} className="text-sm opacity-75">
                Hosted by {avatarName} • Level {lessonLevel}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 p-6">
          {/* Video Section */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Video Player */}
            <motion.div
              className="relative rounded-lg overflow-hidden shadow-xl"
              style={{
                backgroundColor: '#000',
                aspectRatio: '16/9',
                border: `2px solid ${themeConfig.accentColor}`
              }}
              whileHover={{ boxShadow: `0 0 30px ${themeConfig.accentColor}` }}
            >
              {/* Placeholder for video - in production, use <video> element */}
              <div
                className="w-full h-full flex items-center justify-center relative"
                style={{ backgroundColor: themeConfig.backgroundColor }}
              >
                {/* Avatar Image Placeholder */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="w-64 h-64 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.accentColor}, ${themeConfig.brandColor})`,
                      boxShadow: `0 0 60px ${themeConfig.brandColor}`
                    }}
                  >
                    {avatarName.charAt(0)}
                  </div>
                </motion.div>

                {/* Branding Overlay */}
                <div className="absolute bottom-4 right-4 text-white text-xs opacity-75">
                  <p className="font-bold" style={{ color: themeConfig.brandColor }}>
                    Prize2Pride
                  </p>
                  <p className="text-[10px]">CodinCloud</p>
                </div>

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(true)}
                    className="absolute z-10 p-4 rounded-full"
                    style={{
                      backgroundColor: themeConfig.brandColor,
                      color: '#000'
                    }}
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </motion.button>
                )}
              </div>

              {/* Playback Controls */}
              <div
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                style={{ borderTop: `1px solid ${themeConfig.accentColor}` }}
              >
                {/* Progress Bar */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white text-xs font-mono">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={(value) => {
                      setCurrentTime(value[0]);
                      if (audioRef.current) {
                        audioRef.current.currentTime = value[0];
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="text-white text-xs font-mono">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>

                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Subtitle Display */}
            <AnimatePresence mode="wait">
              {currentSubtitle && (
                <motion.div
                  key={currentSubtitle.startTime}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg text-center"
                  style={{
                    backgroundColor: `${themeConfig.accentColor}20`,
                    borderLeft: `4px solid ${currentSubtitle.highlightColor}`
                  }}
                >
                  <p
                    className="text-lg font-semibold"
                    style={{ color: currentSubtitle.highlightColor }}
                    dir={currentSubtitle.language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {currentSubtitle.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Lesson Content & Vocabulary */}
          <div
            className="lg:w-80 overflow-y-auto rounded-lg p-4"
            style={{
              backgroundColor: `${themeConfig.backgroundColor}dd`,
              border: `1px solid ${themeConfig.accentColor}40`
            }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: themeConfig.brandColor }}
            >
              📚 Lesson Overview
            </h3>

            <div className="space-y-4">
              <Badge
                className="w-full justify-center py-2"
                style={{
                  backgroundColor: levelColors[lessonLevel],
                  color: '#fff'
                }}
              >
                Level {lessonLevel}
              </Badge>

              <div>
                <h4
                  className="text-sm font-bold mb-2"
                  style={{ color: themeConfig.textColor }}
                >
                  Learning Objectives
                </h4>
                <ul className="text-xs space-y-1" style={{ color: themeConfig.textColor }}>
                  <li>✓ Master key vocabulary and expressions</li>
                  <li>✓ Improve pronunciation and fluency</li>
                  <li>✓ Understand cultural context</li>
                  <li>✓ Apply concepts in real-world scenarios</li>
                </ul>
              </div>

              <div>
                <h4
                  className="text-sm font-bold mb-2"
                  style={{ color: themeConfig.textColor }}
                >
                  Progress
                </h4>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: `${themeConfig.accentColor}40` }}
                >
                  <motion.div
                    className="h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentTime / duration) * 100}%` }}
                    style={{ backgroundColor: themeConfig.brandColor }}
                  />
                </div>
                <p
                  className="text-xs mt-2"
                  style={{ color: themeConfig.textColor }}
                >
                  {Math.round((currentTime / duration) * 100)}% Complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </motion.div>
  );
}
