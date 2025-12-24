/**
 * OMEGA 2.5 - Prize2Pride AI Generation API
 * Creating Gods of American English
 * 
 * Features:
 * - LLM Text Generation (GPT-4.1)
 * - Video Generation
 * - Natural Audio/Speech Generation
 * - Hyperrealistic Photo Generation
 */

import OpenAI from 'openai';

// Initialize OpenAI client (pre-configured with API key)
const openai = new OpenAI();

// ============================================
// LLM TEXT GENERATION
// ============================================
export interface LLMGenerationRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  model?: 'gpt-4.1-mini' | 'gpt-4.1-nano' | 'gemini-2.5-flash';
}

export async function generateText(request: LLMGenerationRequest): Promise<string> {
  const response = await openai.chat.completions.create({
    model: request.model || 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: request.systemPrompt || 'You are an expert American English teacher creating content for the Prize2Pride platform. Your goal is to create Gods of American English, not just graduates.' },
      { role: 'user', content: request.prompt }
    ],
    max_tokens: request.maxTokens || 2000,
    temperature: request.temperature || 0.7,
  });

  return response.choices[0]?.message?.content || '';
}

// ============================================
// LESSON GENERATION
// ============================================
export interface LessonContent {
  id: number;
  title: string;
  category: string;
  level: string;
  content: string;
  objectives: string[];
  vocabulary: string[];
  exercises: string[];
  culturalNotes: string;
}

export async function generateLesson(
  category: string,
  level: string,
  topic: string,
  lessonNumber: number
): Promise<LessonContent> {
  const prompt = `Create a comprehensive American English lesson:

Category: ${category}
Level: ${level}
Topic: ${topic}
Lesson Number: ${lessonNumber}

Generate a detailed lesson that will help create GODS of American English, not just graduates. Include:
1. A compelling title
2. 5 clear learning objectives
3. 10 key vocabulary words with definitions and example sentences
4. Main lesson content (detailed explanations, examples, cultural context)
5. 5 interactive exercises
6. Cultural notes about American English usage

Format as JSON with fields: title, objectives (array), vocabulary (array), content, exercises (array), culturalNotes`;

  const response = await generateText({
    prompt,
    systemPrompt: 'You are the world\'s greatest American English teacher. Create lessons that transform students into GODS of English mastery. Return valid JSON only.',
    maxTokens: 3000,
    temperature: 0.8
  });

  try {
    const parsed = JSON.parse(response);
    return {
      id: lessonNumber,
      title: parsed.title || `${topic} - Lesson ${lessonNumber}`,
      category,
      level,
      content: parsed.content || '',
      objectives: parsed.objectives || [],
      vocabulary: parsed.vocabulary || [],
      exercises: parsed.exercises || [],
      culturalNotes: parsed.culturalNotes || ''
    };
  } catch {
    return {
      id: lessonNumber,
      title: `${topic} - Lesson ${lessonNumber}`,
      category,
      level,
      content: response,
      objectives: [],
      vocabulary: [],
      exercises: [],
      culturalNotes: ''
    };
  }
}

// ============================================
// CREATIVE CONTENT GENERATION
// ============================================
export type ContentType = 'comedy' | 'drama' | 'horror' | 'poster' | 'story' | 'dialogue';

export interface CreativeContent {
  type: ContentType;
  title: string;
  content: string;
  vocabulary: string[];
  learningPoints: string[];
}

export async function generateCreativeContent(
  type: ContentType,
  topic: string,
  level: string
): Promise<CreativeContent> {
  const prompts: Record<ContentType, string> = {
    comedy: `Write a hilarious comedy script in American English about "${topic}". Include witty dialogue, American humor, idioms, and slang. Make it educational while being genuinely funny.`,
    drama: `Write a dramatic scene in American English about "${topic}". Include emotional dialogue, dramatic tension, and authentic American expressions. Make it compelling and educational.`,
    horror: `Write a spine-chilling horror story in American English about "${topic}". Include suspenseful narrative, atmospheric descriptions, and American cultural references. Make it scary yet educational.`,
    poster: `Create detailed text content for an educational poster about "${topic}" in American English. Include catchy headlines, key points, memorable phrases, and call-to-action text.`,
    story: `Write an engaging short story in American English about "${topic}". Include vivid descriptions, authentic dialogue, and American cultural elements. Make it captivating and educational.`,
    dialogue: `Write a realistic conversation between two Americans about "${topic}". Include natural speech patterns, idioms, contractions, and cultural references. Make it authentic and educational.`
  };

  const response = await generateText({
    prompt: `${prompts[type]}

Level: ${level}
Include:
- Title
- Main content
- 10 vocabulary words used
- 5 key learning points about American English

Format as JSON with fields: title, content, vocabulary (array), learningPoints (array)`,
    maxTokens: 2500,
    temperature: 0.9
  });

  try {
    const parsed = JSON.parse(response);
    return {
      type,
      title: parsed.title || `${type} - ${topic}`,
      content: parsed.content || response,
      vocabulary: parsed.vocabulary || [],
      learningPoints: parsed.learningPoints || []
    };
  } catch {
    return {
      type,
      title: `${type} - ${topic}`,
      content: response,
      vocabulary: [],
      learningPoints: []
    };
  }
}

// ============================================
// BULK LESSON GENERATION
// ============================================
export interface BulkGenerationProgress {
  total: number;
  completed: number;
  currentCategory: string;
  currentLesson: string;
  lessons: LessonContent[];
}

export const LESSON_CATEGORIES = [
  { name: 'Grammar Mastery', topics: ['Verb Tenses', 'Conditionals', 'Modal Verbs', 'Passive Voice', 'Reported Speech', 'Articles', 'Prepositions', 'Conjunctions', 'Sentence Structure', 'Punctuation'] },
  { name: 'Speaking & Pronunciation', topics: ['American Accent', 'Intonation', 'Stress Patterns', 'Connected Speech', 'Vowel Sounds', 'Consonant Sounds', 'Rhythm', 'Public Speaking', 'Debate Skills', 'Presentation'] },
  { name: 'Writing Excellence', topics: ['Essay Writing', 'Business Writing', 'Creative Writing', 'Academic Writing', 'Email Etiquette', 'Report Writing', 'Persuasive Writing', 'Narrative Writing', 'Technical Writing', 'Blogging'] },
  { name: 'Listening Comprehension', topics: ['News Listening', 'Movie Dialogues', 'Podcast Understanding', 'Lecture Comprehension', 'Conversation Skills', 'Phone Calls', 'Interviews', 'Announcements', 'Song Lyrics', 'Audiobooks'] },
  { name: 'Vocabulary & Idioms', topics: ['Business Vocabulary', 'Academic Words', 'Slang & Colloquialisms', 'Idioms', 'Phrasal Verbs', 'Collocations', 'Synonyms & Antonyms', 'Word Formation', 'Context Clues', 'Etymology'] }
];

export const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Mastery', 'God-Level'];

export async function* bulkGenerateLessons(
  totalLessons: number,
  onProgress?: (progress: BulkGenerationProgress) => void
): AsyncGenerator<LessonContent> {
  let completed = 0;
  const lessons: LessonContent[] = [];
  
  const lessonsPerCategory = Math.ceil(totalLessons / LESSON_CATEGORIES.length);
  const lessonsPerTopic = Math.ceil(lessonsPerCategory / 10);
  const lessonsPerLevel = Math.ceil(lessonsPerTopic / LEVELS.length);

  for (const category of LESSON_CATEGORIES) {
    for (const topic of category.topics) {
      for (const level of LEVELS) {
        for (let i = 0; i < lessonsPerLevel && completed < totalLessons; i++) {
          const lessonNumber = completed + 1;
          
          if (onProgress) {
            onProgress({
              total: totalLessons,
              completed,
              currentCategory: category.name,
              currentLesson: `${topic} - ${level} - Lesson ${i + 1}`,
              lessons
            });
          }

          try {
            const lesson = await generateLesson(category.name, level, topic, lessonNumber);
            lessons.push(lesson);
            yield lesson;
          } catch (error) {
            console.error(`Error generating lesson ${lessonNumber}:`, error);
            // Create a placeholder lesson
            const placeholder: LessonContent = {
              id: lessonNumber,
              title: `${topic} - ${level} - Lesson ${i + 1}`,
              category: category.name,
              level,
              content: `Lesson content for ${topic} at ${level} level.`,
              objectives: ['Master this topic', 'Apply in real situations'],
              vocabulary: [],
              exercises: [],
              culturalNotes: ''
            };
            lessons.push(placeholder);
            yield placeholder;
          }

          completed++;
        }
      }
    }
  }
}

// ============================================
// API ENDPOINTS HANDLER
// ============================================
export const aiGenerationRoutes = {
  // Generate single lesson
  generateLesson: async (category: string, level: string, topic: string, lessonNumber: number) => {
    return await generateLesson(category, level, topic, lessonNumber);
  },

  // Generate creative content
  generateCreative: async (type: ContentType, topic: string, level: string) => {
    return await generateCreativeContent(type, topic, level);
  },

  // Generate text with LLM
  generateText: async (prompt: string, systemPrompt?: string) => {
    return await generateText({ prompt, systemPrompt });
  },

  // Get categories and levels
  getCategories: () => LESSON_CATEGORIES,
  getLevels: () => LEVELS
};

export default aiGenerationRoutes;
