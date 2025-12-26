/**
 * Text-to-Speech Router for Prize2Pride Platform
 * Handles audio generation for lessons and vocabulary
 */

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { generateSpeech, generateAvatarSpeech, avatarVoices } from "../_core/textToSpeech";

export const ttsRouter = router({
  /**
   * Generate audio for lesson content
   */
  generateLessonAudio: publicProcedure
    .input(
      z.object({
        content: z.string().min(1).max(4096),
        avatarId: z.string().optional().default("nova"),
      })
    )
    .mutation(async ({ input }) => {
      const { content, avatarId } = input;
      
      // Use avatar-specific voice or default to nova
      const voice = avatarVoices[avatarId] || "nova";
      
      const result = await generateSpeech({
        text: content,
        voice,
        speed: 1.0,
        model: "tts-1-hd",
      });
      
      return result;
    }),

  /**
   * Generate pronunciation audio for a word
   */
  generatePronunciation: publicProcedure
    .input(
      z.object({
        word: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const result = await generateSpeech({
        text: input.word,
        voice: "nova",
        speed: 0.85, // Slower for clear pronunciation
        model: "tts-1-hd",
      });
      
      return result;
    }),

  /**
   * Generate avatar speech with personality
   */
  generateAvatarSpeech: publicProcedure
    .input(
      z.object({
        text: z.string().min(1).max(4096),
        avatarId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await generateAvatarSpeech(input.text, input.avatarId);
      return result;
    }),

  /**
   * Get available voices
   */
  getVoices: publicProcedure.query(() => {
    return {
      voices: [
        { id: "alloy", name: "Alloy", description: "Clear and patient - ideal for tutoring" },
        { id: "echo", name: "Echo", description: "Energetic and motivating - great for coaching" },
        { id: "fable", name: "Fable", description: "Expressive and engaging - perfect for storytelling" },
        { id: "onyx", name: "Onyx", description: "Deep and authoritative - professional tone" },
        { id: "nova", name: "Nova", description: "Warm and conversational - natural American English" },
        { id: "shimmer", name: "Shimmer", description: "Calm and supportive - mentoring style" },
      ],
      avatarVoices,
    };
  }),
});
