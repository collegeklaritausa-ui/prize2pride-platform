/**
 * AI Image Generation Service for Prize2Pride Platform
 * Generates educational images and hyper-realistic feminine avatars
 * for interactive augmented learning experiences
 */

import OpenAI from 'openai';

const openai = new OpenAI();

// ============ TYPES ============

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  type: 'educational' | 'avatar' | 'scenario' | 'vocabulary' | 'culture';
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface AvatarConfig {
  name: string;
  personality: string;
  specialty: string;
  appearance: {
    style: 'professional' | 'casual' | 'academic' | 'friendly';
    ageRange: '20s' | '30s' | '40s';
    ethnicity: 'diverse' | 'caucasian' | 'asian' | 'african' | 'hispanic' | 'middle-eastern';
    hairStyle: string;
    outfit: string;
    expression: 'warm' | 'confident' | 'encouraging' | 'thoughtful';
  };
  voiceId?: string;
}

export interface EducationalImageRequest {
  topic: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  style: 'realistic' | 'illustrated' | 'infographic' | 'diagram';
  context?: string;
}

export interface ScenarioImageRequest {
  scenario: string;
  setting: string;
  characters?: string[];
  mood: 'professional' | 'casual' | 'formal' | 'relaxed';
  includeText?: boolean;
}

// ============ AVATAR GENERATION ============

/**
 * Pre-defined avatar templates for consistent character generation
 */
export const avatarTemplates: Record<string, AvatarConfig> = {
  'professor-emma': {
    name: 'Professor Emma',
    personality: 'Warm, patient, and highly knowledgeable. Explains complex grammar with clarity and encouragement.',
    specialty: 'Grammar & Academic English',
    appearance: {
      style: 'academic',
      ageRange: '30s',
      ethnicity: 'diverse',
      hairStyle: 'elegant shoulder-length brown hair',
      outfit: 'sophisticated blazer with glasses',
      expression: 'warm'
    }
  },
  'coach-sophia': {
    name: 'Coach Sophia',
    personality: 'Energetic, motivating, and fun. Makes learning feel like an exciting adventure.',
    specialty: 'Conversation & Speaking Practice',
    appearance: {
      style: 'casual',
      ageRange: '20s',
      ethnicity: 'diverse',
      hairStyle: 'vibrant wavy auburn hair',
      outfit: 'smart casual with colorful accessories',
      expression: 'encouraging'
    }
  },
  'mentor-olivia': {
    name: 'Mentor Olivia',
    personality: 'Calm, supportive, and insightful. Guides learners through challenges with wisdom.',
    specialty: 'Business English & Professional Communication',
    appearance: {
      style: 'professional',
      ageRange: '30s',
      ethnicity: 'diverse',
      hairStyle: 'sleek dark hair in professional style',
      outfit: 'elegant business attire',
      expression: 'confident'
    }
  },
  'guide-maya': {
    name: 'Guide Maya',
    personality: 'Curious, adventurous, and culturally aware. Brings American culture to life.',
    specialty: 'Cultural Learning & Idioms',
    appearance: {
      style: 'friendly',
      ageRange: '20s',
      ethnicity: 'diverse',
      hairStyle: 'natural curly black hair',
      outfit: 'trendy modern American style',
      expression: 'warm'
    }
  },
  'tutor-lily': {
    name: 'Tutor Lily',
    personality: 'Gentle, encouraging, and detail-oriented. Perfect for beginners.',
    specialty: 'Beginner English & Vocabulary',
    appearance: {
      style: 'friendly',
      ageRange: '20s',
      ethnicity: 'asian',
      hairStyle: 'long straight black hair with soft bangs',
      outfit: 'comfortable yet stylish casual wear',
      expression: 'encouraging'
    }
  },
  'instructor-isabella': {
    name: 'Instructor Isabella',
    personality: 'Passionate, expressive, and engaging. Makes pronunciation fun.',
    specialty: 'Pronunciation & Listening',
    appearance: {
      style: 'casual',
      ageRange: '30s',
      ethnicity: 'hispanic',
      hairStyle: 'flowing dark wavy hair',
      outfit: 'artistic bohemian style',
      expression: 'warm'
    }
  }
};

/**
 * Generate a hyper-realistic feminine avatar image
 */
export async function generateAvatarImage(
  avatarId: string,
  pose: 'portrait' | 'teaching' | 'presenting' | 'thinking' | 'celebrating' = 'portrait',
  emotion: 'neutral' | 'happy' | 'encouraging' | 'thoughtful' | 'excited' = 'neutral'
): Promise<GeneratedImage> {
  const avatar = avatarTemplates[avatarId];
  if (!avatar) {
    throw new Error(`Avatar template '${avatarId}' not found`);
  }

  const poseDescriptions: Record<string, string> = {
    portrait: 'professional headshot portrait, looking warmly at camera',
    teaching: 'gesturing while explaining, engaged teaching pose',
    presenting: 'confident presentation stance, pointing or gesturing',
    thinking: 'thoughtful pose with hand near chin, contemplative',
    celebrating: 'joyful celebratory pose, arms raised or clapping'
  };

  const emotionDescriptions: Record<string, string> = {
    neutral: 'calm and approachable expression',
    happy: 'bright genuine smile, sparkling eyes',
    encouraging: 'warm supportive smile, inviting expression',
    thoughtful: 'contemplative expression, gentle knowing look',
    excited: 'enthusiastic expression, energetic and vibrant'
  };

  const prompt = `Hyper-realistic professional photograph of a beautiful ${avatar.appearance.ageRange} woman, 
${avatar.appearance.hairStyle}, wearing ${avatar.appearance.outfit}, 
${poseDescriptions[pose]}, ${emotionDescriptions[emotion]}.
High-end studio lighting, soft bokeh background in warm educational setting,
8K resolution, photorealistic, professional headshot quality,
warm and inviting atmosphere, modern American style.
The image should convey intelligence, warmth, and approachability.
Perfect for educational platform avatar.`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from API');
    }

    return {
      id: `avatar-${avatarId}-${Date.now()}`,
      url: imageUrl,
      prompt: prompt,
      type: 'avatar',
      metadata: {
        avatarId,
        avatarName: avatar.name,
        pose,
        emotion,
        specialty: avatar.specialty
      },
      createdAt: new Date()
    };
  } catch (error) {
    console.error('[AI Image] Error generating avatar:', error);
    throw error;
  }
}

/**
 * Generate a complete avatar set with multiple poses and emotions
 */
export async function generateAvatarSet(avatarId: string): Promise<GeneratedImage[]> {
  const poses: Array<'portrait' | 'teaching' | 'presenting' | 'thinking' | 'celebrating'> = 
    ['portrait', 'teaching', 'presenting', 'thinking', 'celebrating'];
  
  const images: GeneratedImage[] = [];
  
  for (const pose of poses) {
    const emotion = pose === 'celebrating' ? 'excited' : 
                    pose === 'thinking' ? 'thoughtful' : 
                    pose === 'teaching' ? 'encouraging' : 'happy';
    
    const image = await generateAvatarImage(avatarId, pose, emotion);
    images.push(image);
  }
  
  return images;
}

// ============ EDUCATIONAL IMAGE GENERATION ============

/**
 * Generate educational images for lessons and vocabulary
 */
export async function generateEducationalImage(
  request: EducationalImageRequest
): Promise<GeneratedImage> {
  const styleDescriptions: Record<string, string> = {
    realistic: 'photorealistic, high-quality photograph',
    illustrated: 'beautiful digital illustration, clean modern style',
    infographic: 'clean infographic design, educational layout',
    diagram: 'clear educational diagram, labeled and organized'
  };

  const levelContext: Record<string, string> = {
    'A1': 'simple, clear, beginner-friendly visuals',
    'A2': 'straightforward imagery with some detail',
    'B1': 'moderately detailed, intermediate complexity',
    'B2': 'detailed and nuanced imagery',
    'C1': 'sophisticated and complex visuals',
    'C2': 'highly detailed, professional-level imagery'
  };

  const prompt = `${styleDescriptions[request.style]} depicting "${request.topic}" 
for English language learning, ${levelContext[request.level]}.
Category: ${request.category}.
${request.context ? `Context: ${request.context}.` : ''}
Educational, clear, culturally appropriate for American English learning.
High quality, professional, engaging for language learners.
Clean composition, good lighting, visually appealing.`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: request.style === 'realistic' ? 'natural' : 'vivid'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from API');
    }

    return {
      id: `edu-${request.category}-${Date.now()}`,
      url: imageUrl,
      prompt: prompt,
      type: 'educational',
      metadata: {
        topic: request.topic,
        level: request.level,
        category: request.category,
        style: request.style
      },
      createdAt: new Date()
    };
  } catch (error) {
    console.error('[AI Image] Error generating educational image:', error);
    throw error;
  }
}

/**
 * Generate vocabulary illustration
 */
export async function generateVocabularyImage(
  word: string,
  definition: string,
  exampleSentence: string,
  level: string
): Promise<GeneratedImage> {
  const prompt = `Clean, clear illustration representing the English word "${word}" 
meaning "${definition}". 
Context: "${exampleSentence}"
Educational vocabulary card style, visually memorable,
appropriate for ${level} English learners.
Simple background, focused subject, high quality illustration.
Modern, friendly, engaging visual style.`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from API');
    }

    return {
      id: `vocab-${word}-${Date.now()}`,
      url: imageUrl,
      prompt: prompt,
      type: 'vocabulary',
      metadata: {
        word,
        definition,
        exampleSentence,
        level
      },
      createdAt: new Date()
    };
  } catch (error) {
    console.error('[AI Image] Error generating vocabulary image:', error);
    throw error;
  }
}

// ============ SCENARIO IMAGE GENERATION ============

/**
 * Generate scenario/dialogue scene images
 */
export async function generateScenarioImage(
  request: ScenarioImageRequest
): Promise<GeneratedImage> {
  const moodDescriptions: Record<string, string> = {
    professional: 'professional business environment, formal atmosphere',
    casual: 'relaxed casual setting, friendly atmosphere',
    formal: 'formal elegant setting, sophisticated atmosphere',
    relaxed: 'comfortable cozy environment, warm atmosphere'
  };

  const prompt = `Photorealistic scene of "${request.scenario}" 
in a ${request.setting}, ${moodDescriptions[request.mood]}.
${request.characters ? `Characters: ${request.characters.join(', ')}.` : ''}
American cultural context, modern setting.
High quality, cinematic lighting, engaging composition.
Perfect for English conversation practice scenario.
${request.includeText ? 'Include subtle environmental text/signage.' : ''}`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from API');
    }

    return {
      id: `scenario-${Date.now()}`,
      url: imageUrl,
      prompt: prompt,
      type: 'scenario',
      metadata: {
        scenario: request.scenario,
        setting: request.setting,
        mood: request.mood,
        characters: request.characters
      },
      createdAt: new Date()
    };
  } catch (error) {
    console.error('[AI Image] Error generating scenario image:', error);
    throw error;
  }
}

// ============ CULTURAL IMAGE GENERATION ============

/**
 * Generate American culture educational images
 */
export async function generateCultureImage(
  topic: string,
  aspect: 'tradition' | 'landmark' | 'food' | 'lifestyle' | 'celebration' | 'workplace'
): Promise<GeneratedImage> {
  const aspectDescriptions: Record<string, string> = {
    tradition: 'traditional American cultural practice',
    landmark: 'iconic American landmark or location',
    food: 'authentic American cuisine and dining',
    lifestyle: 'typical American daily life scene',
    celebration: 'American holiday or celebration',
    workplace: 'American workplace environment'
  };

  const prompt = `Beautiful high-quality photograph showcasing ${aspectDescriptions[aspect]}: "${topic}".
Authentic American cultural representation, modern and diverse.
Educational context for English language learners.
Vibrant colors, professional photography, engaging composition.
Captures the essence of American culture accurately and respectfully.`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from API');
    }

    return {
      id: `culture-${aspect}-${Date.now()}`,
      url: imageUrl,
      prompt: prompt,
      type: 'culture',
      metadata: {
        topic,
        aspect
      },
      createdAt: new Date()
    };
  } catch (error) {
    console.error('[AI Image] Error generating culture image:', error);
    throw error;
  }
}

// ============ BATCH GENERATION ============

/**
 * Generate multiple images for a lesson
 */
export async function generateLessonImageSet(
  lessonTitle: string,
  lessonCategory: string,
  level: string,
  vocabularyWords: string[]
): Promise<{
  heroImage: GeneratedImage;
  vocabularyImages: GeneratedImage[];
  scenarioImage: GeneratedImage;
}> {
  // Generate hero image for the lesson
  const heroImage = await generateEducationalImage({
    topic: lessonTitle,
    level: level as any,
    category: lessonCategory,
    style: 'realistic'
  });

  // Generate vocabulary images
  const vocabularyImages: GeneratedImage[] = [];
  for (const word of vocabularyWords.slice(0, 5)) { // Limit to 5 for performance
    const vocabImage = await generateVocabularyImage(
      word,
      `Definition of ${word}`,
      `Example sentence using ${word}`,
      level
    );
    vocabularyImages.push(vocabImage);
  }

  // Generate scenario image
  const scenarioImage = await generateScenarioImage({
    scenario: `Practicing ${lessonTitle}`,
    setting: getCategorySettingMap(lessonCategory),
    mood: 'casual'
  });

  return {
    heroImage,
    vocabularyImages,
    scenarioImage
  };
}

function getCategorySettingMap(category: string): string {
  const settings: Record<string, string> = {
    'daily_conversation': 'modern American home or cafe',
    'business': 'professional office environment',
    'travel': 'airport or tourist destination',
    'academic': 'university campus or library',
    'social': 'social gathering or party',
    'culture': 'American cultural venue',
    'idioms': 'everyday American setting',
    'pronunciation': 'language learning studio'
  };
  return settings[category] || 'modern American setting';
}

// ============ AVATAR ANIMATION FRAMES ============

/**
 * Generate animation frame sequence for avatar
 */
export async function generateAvatarAnimationFrames(
  avatarId: string,
  animation: 'speaking' | 'nodding' | 'waving' | 'thinking' | 'celebrating'
): Promise<GeneratedImage[]> {
  const avatar = avatarTemplates[avatarId];
  if (!avatar) {
    throw new Error(`Avatar template '${avatarId}' not found`);
  }

  const animationFrames: Record<string, string[]> = {
    speaking: [
      'mouth slightly open, mid-speech',
      'mouth closed, listening expression',
      'mouth open, emphasizing point',
      'gentle smile, pausing'
    ],
    nodding: [
      'head straight, attentive',
      'head slightly tilted down, understanding',
      'head back to center, agreeing',
      'slight smile, encouraging'
    ],
    waving: [
      'hand raised in greeting',
      'hand mid-wave',
      'hand completing wave',
      'warm welcoming smile'
    ],
    thinking: [
      'looking slightly up, contemplating',
      'hand near chin, deep thought',
      'eyes focused, processing',
      'slight smile, idea forming'
    ],
    celebrating: [
      'arms beginning to raise',
      'arms up, excited expression',
      'clapping hands together',
      'joyful celebration pose'
    ]
  };

  const frames: GeneratedImage[] = [];
  const frameDescriptions = animationFrames[animation];

  for (let i = 0; i < frameDescriptions.length; i++) {
    const prompt = `Hyper-realistic photograph of ${avatar.name}, 
${avatar.appearance.hairStyle}, wearing ${avatar.appearance.outfit},
${frameDescriptions[i]}.
Animation frame ${i + 1} of ${frameDescriptions.length} for ${animation} animation.
Consistent lighting, same background, professional quality.
Perfect for smooth animation sequence.`;

    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      });

      const imageUrl = response.data[0]?.url;
      if (imageUrl) {
        frames.push({
          id: `avatar-anim-${avatarId}-${animation}-${i}`,
          url: imageUrl,
          prompt: prompt,
          type: 'avatar',
          metadata: {
            avatarId,
            animation,
            frameIndex: i,
            totalFrames: frameDescriptions.length
          },
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error(`[AI Image] Error generating animation frame ${i}:`, error);
    }
  }

  return frames;
}

export default {
  generateAvatarImage,
  generateAvatarSet,
  generateEducationalImage,
  generateVocabularyImage,
  generateScenarioImage,
  generateCultureImage,
  generateLessonImageSet,
  generateAvatarAnimationFrames,
  avatarTemplates
};
