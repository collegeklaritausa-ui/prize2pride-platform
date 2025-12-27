/**
 * Prize2Pride - AMOS Lesson Trigger Hook
 * Autonomous Multimedia Orchestration System
 * 
 * This hook handles the onLessonClick event to trigger hyper-realistic
 * video generation via the simulated AI multimedia API.
 * 
 * Features:
 * - TTS-1-HD Nova voice synthesis for American English
 * - Host couple avatar animation simulation
 * - Casino-show studio atmosphere with Gold & Diamond branding
 * - Bilingual EN/AR support
 */

import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

// Types for AMOS orchestration
export interface LessonData {
  id: number;
  fileId?: string;
  title: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  duration: number;
  xpReward: number;
  avatarId?: string;
  content?: string;
  objectives?: string[];
}

export interface AmosOutput {
  videoUrl: string;
  audioUrl: string;
  subtitles: SubtitleSegment[];
  avatarAnimationData: AvatarAnimation;
  theme: StudioTheme;
}

export interface SubtitleSegment {
  id: number;
  text: string;
  textAr?: string;
  startTime: number;
  endTime: number;
  isHighlighted: boolean;
}

export interface AvatarAnimation {
  avatarId: string;
  imagePath: string;
  lipSyncData: LipSyncFrame[];
  expressionKeyframes: ExpressionKeyframe[];
}

export interface LipSyncFrame {
  time: number;
  viseme: string;
  intensity: number;
}

export interface ExpressionKeyframe {
  time: number;
  expression: 'neutral' | 'happy' | 'encouraging' | 'thoughtful' | 'excited';
}

export interface StudioTheme {
  backgroundColor: string;
  accentColor: string;
  brandColor: string;
  textColor: string;
  highlightColor: string;
  gradientStart: string;
  gradientEnd: string;
}

// Host couple avatar mapping
const HOST_COUPLES: Record<string, { name: string; imagePath: string; specialty: string }> = {
  'host-couple-1': { name: 'Sarah & Michael', imagePath: '/avatars/host-couple-1.png', specialty: 'Grammar Masters' },
  'host-couple-2': { name: 'Emma & James', imagePath: '/avatars/host-couple-2.png', specialty: 'Conversation Coaches' },
  'host-couple-3': { name: 'Olivia & William', imagePath: '/avatars/host-couple-3.png', specialty: 'Vocabulary Champions' },
  'host-couple-tunisian-1': { name: 'Yasmine & Ahmed', imagePath: '/avatars/tunisian-couple-1.png', specialty: 'Cultural Ambassadors' },
  'host-couple-tunisian-2': { name: 'Fatma & Khalil', imagePath: '/avatars/tunisian-couple-2.png', specialty: 'Pronunciation Experts' },
  'nova': { name: 'Nova & Alex', imagePath: '/avatars/nova-couple.png', specialty: 'AI Language Guides' },
};

// Studio themes for casino-show atmosphere
const STUDIO_THEMES: Record<string, StudioTheme> = {
  'casino-gold': {
    backgroundColor: '#0a0a1a',
    accentColor: '#ffd700',
    brandColor: '#ffd700',
    textColor: '#ffffff',
    highlightColor: '#ffed4e',
    gradientStart: '#1a1a2e',
    gradientEnd: '#0a0a1a',
  },
  'diamond-luxury': {
    backgroundColor: '#0f0f1f',
    accentColor: '#b9f2ff',
    brandColor: '#e0e0e0',
    textColor: '#ffffff',
    highlightColor: '#ffffff',
    gradientStart: '#1f1f3f',
    gradientEnd: '#0f0f1f',
  },
  'emerald-elegance': {
    backgroundColor: '#0a1f12',
    accentColor: '#50c878',
    brandColor: '#00d084',
    textColor: '#e8f5e9',
    highlightColor: '#4ade80',
    gradientStart: '#0f2f1a',
    gradientEnd: '#0a1f12',
  },
};

/**
 * Main hook for AMOS lesson trigger
 */
export function useAmosLessonTrigger() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [amosOutput, setAmosOutput] = useState<AmosOutput | null>(null);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // tRPC mutation for AMOS orchestration
  const amosMutation = trpc.amos.orchestrate.useMutation();

  /**
   * onLessonClick - Main trigger function
   * Called when user clicks on any lesson link
   */
  const onLessonClick = useCallback(async (lesson: LessonData) => {
    setIsLoading(true);
    setError(null);
    setCurrentLesson(lesson);

    try {
      // Get host couple for this lesson
      const hostCouple = HOST_COUPLES[lesson.avatarId || 'nova'] || HOST_COUPLES['nova'];
      
      // Select studio theme based on level
      const themeKey = lesson.level.startsWith('C') ? 'diamond-luxury' : 
                       lesson.level.startsWith('B') ? 'emerald-elegance' : 'casino-gold';
      const theme = STUDIO_THEMES[themeKey];

      // Prepare lesson content for TTS
      const lessonContent = extractTextContent(lesson.content || lesson.description);

      // Call AMOS orchestration API
      const result = await amosMutation.mutateAsync({
        lessonId: String(lesson.id),
        lessonTitle: lesson.title,
        lessonContent: lessonContent,
        avatarId: lesson.avatarId || 'nova',
        avatarImagePath: hostCouple.imagePath,
        language: 'en',
        studioTheme: 'casino-gold',
      });

      // Generate simulated AMOS output with hyper-realistic data
      const output = generateAmosOutput(lesson, hostCouple, theme, lessonContent);
      
      setAmosOutput(output);
      setIsPlaying(true);
      setCurrentSubtitleIndex(0);

      return output;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AMOS orchestration failed';
      setError(errorMessage);
      console.error('[AMOS] Error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [amosMutation]);

  /**
   * Stop the current lesson playback
   */
  const stopLesson = useCallback(() => {
    setIsPlaying(false);
    setCurrentSubtitleIndex(0);
  }, []);

  /**
   * Advance to next subtitle segment
   */
  const advanceSubtitle = useCallback(() => {
    if (amosOutput && currentSubtitleIndex < amosOutput.subtitles.length - 1) {
      setCurrentSubtitleIndex(prev => prev + 1);
    }
  }, [amosOutput, currentSubtitleIndex]);

  /**
   * Get current subtitle
   */
  const getCurrentSubtitle = useCallback(() => {
    if (!amosOutput) return null;
    return amosOutput.subtitles[currentSubtitleIndex] || null;
  }, [amosOutput, currentSubtitleIndex]);

  return {
    // State
    isLoading,
    isPlaying,
    currentLesson,
    amosOutput,
    currentSubtitleIndex,
    error,
    
    // Actions
    onLessonClick,
    stopLesson,
    advanceSubtitle,
    getCurrentSubtitle,
    
    // Setters for external control
    setIsPlaying,
    setCurrentSubtitleIndex,
  };
}

/**
 * Extract plain text content from HTML
 */
function extractTextContent(html: string): string {
  if (!html) return '';
  // Remove HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate simulated AMOS output with hyper-realistic data
 */
function generateAmosOutput(
  lesson: LessonData,
  hostCouple: { name: string; imagePath: string; specialty: string },
  theme: StudioTheme,
  textContent: string
): AmosOutput {
  // Split content into subtitle segments
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const subtitles: SubtitleSegment[] = sentences.map((sentence, index) => ({
    id: index + 1,
    text: sentence.trim(),
    textAr: '', // Arabic translation would be added here
    startTime: index * 4000, // 4 seconds per segment
    endTime: (index + 1) * 4000,
    isHighlighted: false,
  }));

  // Generate lip-sync data (simulated viseme sequence)
  const lipSyncData: LipSyncFrame[] = [];
  const visemes = ['sil', 'aa', 'ee', 'ih', 'oh', 'oo', 'th', 'f', 'k', 's', 'sh', 'l', 'r', 'w'];
  for (let i = 0; i < textContent.length * 2; i++) {
    lipSyncData.push({
      time: i * 50,
      viseme: visemes[Math.floor(Math.random() * visemes.length)],
      intensity: 0.5 + Math.random() * 0.5,
    });
  }

  // Generate expression keyframes
  const expressionKeyframes: ExpressionKeyframe[] = subtitles.map((_, index) => ({
    time: index * 4000,
    expression: ['neutral', 'happy', 'encouraging', 'thoughtful', 'excited'][
      Math.floor(Math.random() * 5)
    ] as ExpressionKeyframe['expression'],
  }));

  return {
    videoUrl: `data:video/mp4;base64,SIMULATED_HYPER_REALISTIC_VIDEO_${lesson.id}`,
    audioUrl: `/api/tts/lesson/${lesson.id}`,
    subtitles,
    avatarAnimationData: {
      avatarId: lesson.avatarId || 'nova',
      imagePath: hostCouple.imagePath,
      lipSyncData,
      expressionKeyframes,
    },
    theme,
  };
}

/**
 * Hook for TTS audio playback with subtitle synchronization
 */
export function useAmosAudioPlayer(amosOutput: AmosOutput | null) {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const initAudio = useCallback((audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime * 1000));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration * 1000));
    setAudioElement(audio);
    return audio;
  }, []);

  const play = useCallback(() => {
    audioElement?.play();
  }, [audioElement]);

  const pause = useCallback(() => {
    audioElement?.pause();
  }, [audioElement]);

  const seek = useCallback((time: number) => {
    if (audioElement) {
      audioElement.currentTime = time / 1000;
    }
  }, [audioElement]);

  const getCurrentSubtitleIndex = useCallback(() => {
    if (!amosOutput) return 0;
    const index = amosOutput.subtitles.findIndex(
      sub => currentTime >= sub.startTime && currentTime < sub.endTime
    );
    return index >= 0 ? index : 0;
  }, [amosOutput, currentTime]);

  return {
    audioElement,
    currentTime,
    duration,
    initAudio,
    play,
    pause,
    seek,
    getCurrentSubtitleIndex,
  };
}

export default useAmosLessonTrigger;
