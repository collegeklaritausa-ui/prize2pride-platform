/**
 * Text-to-Speech Service for Prize2Pride Platform
 * Provides audio generation for vocabulary pronunciation and lesson content
 */

import { ENV } from './env';

interface TTSOptions {
  text: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number;
  model?: 'tts-1' | 'tts-1-hd';
}

interface TTSResponse {
  audioUrl: string;
  duration?: number;
}

/**
 * Generate speech audio from text using OpenAI TTS API
 */
export async function generateSpeech(options: TTSOptions): Promise<TTSResponse> {
  const {
    text,
    voice = 'nova', // Natural American English voice
    speed = 1.0,
    model = 'tts-1'
  } = options;

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        speed,
        response_format: 'mp3'
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    // Convert audio buffer to base64 data URL
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const audioUrl = `data:audio/mp3;base64,${base64}`;

    return { audioUrl };
  } catch (error) {
    console.error('[TTS] Error generating speech:', error);
    throw error;
  }
}

/**
 * Generate pronunciation audio for a vocabulary word
 */
export async function generatePronunciation(word: string): Promise<TTSResponse> {
  return generateSpeech({
    text: word,
    voice: 'nova',
    speed: 0.9, // Slightly slower for clarity
    model: 'tts-1-hd' // Higher quality for pronunciation
  });
}

/**
 * Generate audio for lesson content
 */
export async function generateLessonAudio(content: string): Promise<TTSResponse> {
  return generateSpeech({
    text: content,
    voice: 'nova',
    speed: 1.0,
    model: 'tts-1'
  });
}

/**
 * Avatar voice configurations
 */
export const avatarVoices: Record<string, 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'> = {
  'professor': 'onyx',      // Deep, authoritative
  'coach': 'echo',          // Energetic, motivating
  'friend': 'nova',         // Warm, conversational
  'tutor': 'alloy',         // Clear, patient
  'storyteller': 'fable',   // Expressive, engaging
  'mentor': 'shimmer'       // Calm, supportive
};

/**
 * Generate avatar speech with personality-matched voice
 */
export async function generateAvatarSpeech(
  text: string, 
  avatarId: string
): Promise<TTSResponse> {
  const voice = avatarVoices[avatarId] || 'nova';
  return generateSpeech({
    text,
    voice,
    speed: 1.0,
    model: 'tts-1-hd'
  });
}
