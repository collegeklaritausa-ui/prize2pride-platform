/**
 * AI-Powered Lesson Enhancer for Prize2Pride Platform
 * Generates detailed, unique content for each lesson using OpenAI API
 * 
 * Marketed by CodinCloud - Turning Ideas into Sophisticated Platforms
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI();

interface LessonData {
  id: string;
  level: string;
  unitNumber: number;
  lessonNumber: number;
  title: string;
  subtitle: string;
  duration: number;
  xpReward: number;
  avatarId: string;
  category: string;
  objectives: string[];
  objectivesArabic: string;
  content: string;
  culturalNotes: string;
  vocabulary: any[];
  materials: string[];
  exercises: any[];
  metadata: any;
}

// Generate enhanced content for a lesson using AI
async function enhanceLessonWithAI(lesson: LessonData): Promise<LessonData> {
  const prompt = `You are an expert American English teacher creating content for the Prize2Pride language learning platform.

Generate comprehensive, well-formatted lesson content for:
- Topic: ${lesson.title}
- Level: ${lesson.level} (CEFR)
- Unit: ${lesson.subtitle}
- Category: ${lesson.category}

Requirements:
1. Use proper HTML formatting with styled headings and sections
2. Include bilingual content (English and Arabic translations)
3. Make content appropriate for the ${lesson.level} proficiency level
4. Include practical examples and real-world usage
5. Add cultural context for American English

Generate the following JSON structure:
{
  "content": "Full HTML lesson content with styled headings, examples, and bilingual explanations",
  "objectives": ["5 specific learning objectives with <b>bold</b> key verbs"],
  "objectivesArabic": "Arabic translation of objectives",
  "culturalNotes": "HTML formatted cultural notes with English and Arabic",
  "vocabulary": [
    {"word": "term", "definition": "clear definition", "example": "example sentence", "translation": "Arabic translation"}
  ],
  "exercises": [
    {"id": 1, "type": "multiple_choice", "question": "question", "options": ["a","b","c","d"], "correctAnswer": 0, "explanation": "why correct", "xpReward": 10}
  ]
}

Make the content engaging, educational, and specifically tailored to American English learners.
Include at least 8 vocabulary words and 5 exercises.
Use emojis in headings: 🎓 📘 📌 🕒 ✍️ 🧠 🌎 💬 📚`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are an expert ESL curriculum developer specializing in American English. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.log(`  ⚠️ No content generated for ${lesson.id}`);
      return lesson;
    }

    const enhanced = JSON.parse(content);
    
    return {
      ...lesson,
      content: enhanced.content || lesson.content,
      objectives: enhanced.objectives || lesson.objectives,
      objectivesArabic: enhanced.objectivesArabic || lesson.objectivesArabic,
      culturalNotes: enhanced.culturalNotes || lesson.culturalNotes,
      vocabulary: enhanced.vocabulary || lesson.vocabulary,
      exercises: enhanced.exercises || lesson.exercises,
      metadata: {
        ...lesson.metadata,
        enhancedAt: new Date().toISOString(),
        enhancedBy: "OpenAI GPT-4.1-mini"
      }
    };
  } catch (error: any) {
    console.log(`  ❌ Error enhancing ${lesson.id}: ${error.message}`);
    return lesson;
  }
}

// Process a single lesson file
async function processLessonFile(filepath: string): Promise<void> {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lesson: LessonData = JSON.parse(content);
    
    // Skip if already enhanced
    if (lesson.metadata?.enhancedBy) {
      console.log(`  ⏭️ Skipping ${lesson.id} (already enhanced)`);
      return;
    }
    
    console.log(`  🔄 Enhancing ${lesson.id}...`);
    const enhanced = await enhanceLessonWithAI(lesson);
    
    fs.writeFileSync(filepath, JSON.stringify(enhanced, null, 2));
    console.log(`  ✅ Enhanced ${lesson.id}`);
  } catch (error: any) {
    console.log(`  ❌ Failed to process ${filepath}: ${error.message}`);
  }
}

// Process lessons in batches
async function processLessonsInBatches(files: string[], batchSize: number = 5): Promise<void> {
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)}...`);
    
    await Promise.all(batch.map(file => processLessonFile(file)));
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < files.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Main function
async function main() {
  const coursesDir = path.join(__dirname, '..', 'courses');
  
  // Get all lesson files
  const lessonFiles: string[] = [];
  
  const levels = fs.readdirSync(coursesDir);
  for (const level of levels) {
    const lessonsDir = path.join(coursesDir, level, 'lessons');
    if (fs.existsSync(lessonsDir)) {
      const files = fs.readdirSync(lessonsDir)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(lessonsDir, f));
      lessonFiles.push(...files);
    }
  }
  
  console.log('🚀 Starting AI-powered lesson enhancement...');
  console.log(`📊 Total lessons to process: ${lessonFiles.length}`);
  console.log('');
  
  // Process specific level if provided as argument
  const targetLevel = process.argv[2];
  let filesToProcess = lessonFiles;
  
  if (targetLevel) {
    filesToProcess = lessonFiles.filter(f => f.includes(`/${targetLevel}-`));
    console.log(`🎯 Filtering to ${targetLevel} level: ${filesToProcess.length} lessons`);
  }
  
  await processLessonsInBatches(filesToProcess, 3);
  
  console.log('\n═'.repeat(50));
  console.log('🎉 Enhancement complete!');
  console.log('═'.repeat(50));
}

main().catch(console.error);
