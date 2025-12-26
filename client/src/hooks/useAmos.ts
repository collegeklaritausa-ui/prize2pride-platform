/**
 * useAmos - React Hook for AMOS Integration
 * Prize2Pride Platform - ARCHITECT_GENESIS_SUPREME Protocol
 * 
 * Manages AMOS orchestration and multimedia generation for lessons
 */

import { useState, useCallback } from 'react';

interface AmosConfig {
  lessonId: string;
  lessonTitle: string;
  lessonContent: string;
  avatarId: string;
  avatarImagePath: string;
  language: 'en' | 'ar';
  studioTheme: 'casino-gold' | 'luxury-blue' | 'emerald-garden' | 'sunset-orange';
}

interface AmosOutput {
  videoUrl: string;
  audioUrl: string;
  subtitles: SubtitleSegment[];
  metadata: AmosMetadata;
}

interface SubtitleSegment {
  startTime: number;
  endTime: number;
  text: string;
  language: 'en' | 'ar';
  highlightColor: string;
}

interface AmosMetadata {
  duration: number;
  quality: 'HD' | '4K';
  voiceModel: 'tts-1-hd';
  syncAccuracy: 'perfect';
  generatedAt: string;
}

interface ThemeConfig {
  backgroundColor: string;
  accentColor: string;
  brandColor: string;
  textColor: string;
  highlightColor: string;
}

export function useAmos() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amosOutput, setAmosOutput] = useState<AmosOutput | null>(null);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);

  const executeAmos = useCallback(async (config: AmosConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[useAmos] Executing AMOS for lesson:', config.lessonId);

      // Call backend AMOS orchestrator
      const response = await fetch('/api/amos/orchestrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`AMOS orchestration failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAmosOutput(data.output);
      setThemeConfig(data.theme);

      console.log('[useAmos] AMOS orchestration complete');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('[useAmos] Error:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    executeAmos,
    isLoading,
    error,
    amosOutput,
    themeConfig
  };
}
