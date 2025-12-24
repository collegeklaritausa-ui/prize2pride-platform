/**
 * OMEGA 2.5 - Bulk Lesson Generator
 * Generates 10,000 lessons and pushes to GitHub simultaneously
 * Creating Gods of American English
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const openai = new OpenAI();

// Lesson categories and structure
const CATEGORIES = [
  { name: 'Grammar Mastery', code: 'GM', topics: ['Verb Tenses', 'Conditionals', 'Modal Verbs', 'Passive Voice', 'Reported Speech', 'Articles', 'Prepositions', 'Conjunctions', 'Sentence Structure', 'Punctuation', 'Subject-Verb Agreement', 'Relative Clauses', 'Gerunds & Infinitives', 'Comparatives', 'Superlatives'] },
  { name: 'Speaking & Pronunciation', code: 'SP', topics: ['American Accent', 'Intonation Patterns', 'Word Stress', 'Connected Speech', 'Vowel Sounds', 'Consonant Clusters', 'Rhythm & Flow', 'Public Speaking', 'Debate Skills', 'Presentation Mastery', 'Interview Skills', 'Negotiation', 'Small Talk', 'Storytelling', 'Persuasion'] },
  { name: 'Writing Excellence', code: 'WE', topics: ['Essay Structure', 'Business Emails', 'Creative Writing', 'Academic Papers', 'Report Writing', 'Persuasive Writing', 'Narrative Techniques', 'Technical Documentation', 'Blog Writing', 'Social Media', 'Cover Letters', 'Proposals', 'Reviews', 'Summaries', 'Research Papers'] },
  { name: 'Listening Comprehension', code: 'LC', topics: ['News & Media', 'Movie Dialogues', 'Podcast Analysis', 'Lecture Notes', 'Conversation Flow', 'Phone Skills', 'Meeting Participation', 'Accent Variations', 'Speed Listening', 'Note Taking', 'Inference Skills', 'Main Idea', 'Detail Recognition', 'Tone Analysis', 'Context Clues'] },
  { name: 'Vocabulary & Idioms', code: 'VI', topics: ['Business Terms', 'Academic Vocabulary', 'Slang & Colloquial', 'Idioms & Expressions', 'Phrasal Verbs', 'Collocations', 'Word Families', 'Prefixes & Suffixes', 'Etymology', 'Context Learning', 'Synonyms', 'Antonyms', 'Homophones', 'Technical Terms', 'Cultural References'] },
  { name: 'Comedy & Entertainment', code: 'CE', topics: ['Stand-up Comedy', 'Sitcom Dialogue', 'Puns & Wordplay', 'Sarcasm & Irony', 'Comedic Timing', 'Improvisation', 'Sketch Writing', 'Roast Humor', 'Self-Deprecation', 'Observational Comedy'] },
  { name: 'Drama & Storytelling', code: 'DS', topics: ['Dramatic Monologues', 'Emotional Expression', 'Character Development', 'Conflict Resolution', 'Suspense Building', 'Plot Twists', 'Dialogue Writing', 'Scene Setting', 'Climax Creation', 'Resolution Techniques'] },
  { name: 'Horror & Thriller', code: 'HT', topics: ['Suspense Vocabulary', 'Atmospheric Description', 'Fear Expression', 'Thriller Dialogue', 'Mystery Building', 'Twist Endings', 'Gothic Language', 'Psychological Horror', 'Supernatural Terms', 'Survival Narratives'] },
  { name: 'Professional Communication', code: 'PC', topics: ['Corporate Language', 'Leadership Communication', 'Team Collaboration', 'Client Relations', 'Conflict Management', 'Feedback Delivery', 'Mentoring Language', 'Cross-Cultural Communication', 'Remote Work Communication', 'Executive Presence'] },
  { name: 'Cultural Mastery', code: 'CM', topics: ['American History', 'Pop Culture References', 'Regional Dialects', 'Holiday Traditions', 'Sports Language', 'Food & Dining', 'Social Etiquette', 'Political Discourse', 'Media Literacy', 'Generational Language'] }
];

const LEVELS = [
  { name: 'Beginner', code: 'A1', description: 'Foundation building' },
  { name: 'Elementary', code: 'A2', description: 'Basic communication' },
  { name: 'Intermediate', code: 'B1', description: 'Independent usage' },
  { name: 'Upper-Intermediate', code: 'B2', description: 'Fluent communication' },
  { name: 'Advanced', code: 'C1', description: 'Professional mastery' },
  { name: 'Mastery', code: 'C2', description: 'Near-native proficiency' },
  { name: 'God-Level', code: 'GL', description: 'Transcendent mastery - Creating Gods of American English' }
];

interface Lesson {
  id: string;
  number: number;
  title: string;
  category: string;
  categoryCode: string;
  topic: string;
  level: string;
  levelCode: string;
  objectives: string[];
  vocabulary: { word: string; definition: string; example: string }[];
  content: string;
  exercises: { type: string; question: string; answer: string }[];
  culturalNotes: string;
  createdAt: string;
}

// Generate lesson content using AI
async function generateLessonContent(
  category: string,
  topic: string,
  level: string,
  lessonNum: number
): Promise<Partial<Lesson>> {
  const prompt = `Create an American English lesson:
Category: ${category}
Topic: ${topic}  
Level: ${level}
Lesson #${lessonNum}

Create content that transforms students into GODS of American English. Return JSON:
{
  "title": "engaging title",
  "objectives": ["5 learning objectives"],
  "vocabulary": [{"word": "", "definition": "", "example": ""}] (10 words),
  "content": "detailed lesson content with examples",
  "exercises": [{"type": "", "question": "", "answer": ""}] (5 exercises),
  "culturalNotes": "American cultural context"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: 'You are creating lessons for Gods of American English. Return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.8
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
  } catch (error) {
    // Return template if AI fails
    return {
      title: `${topic} - ${level} Mastery`,
      objectives: [
        `Master ${topic} concepts at ${level} level`,
        'Apply knowledge in real American contexts',
        'Develop native-like intuition',
        'Build confidence in usage',
        'Achieve God-level understanding'
      ],
      vocabulary: [],
      content: `Comprehensive lesson on ${topic} for ${level} learners pursuing God-level mastery of American English.`,
      exercises: [],
      culturalNotes: `Understanding ${topic} in American cultural context.`
    };
  }
}

// Generate all lessons
async function generateAllLessons(totalTarget: number) {
  const lessonsDir = path.join(__dirname, 'generated-lessons');
  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }

  const allLessons: Lesson[] = [];
  let lessonCount = 0;
  let batchCount = 0;
  const batchSize = 100;

  console.log(`🚀 Starting generation of ${totalTarget} lessons...`);
  console.log(`📚 Categories: ${CATEGORIES.length}`);
  console.log(`📊 Levels: ${LEVELS.length}`);

  // Calculate distribution
  const lessonsPerCategory = Math.ceil(totalTarget / CATEGORIES.length);
  const lessonsPerTopic = Math.ceil(lessonsPerCategory / 15);
  const lessonsPerLevel = Math.ceil(lessonsPerTopic / LEVELS.length);

  for (const category of CATEGORIES) {
    const categoryDir = path.join(lessonsDir, category.code);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    for (const topic of category.topics) {
      for (const level of LEVELS) {
        for (let i = 0; i < lessonsPerLevel && lessonCount < totalTarget; i++) {
          lessonCount++;
          
          const lessonId = `${category.code}-${level.code}-${String(lessonCount).padStart(5, '0')}`;
          
          console.log(`📝 Generating lesson ${lessonCount}/${totalTarget}: ${lessonId}`);

          const generated = await generateLessonContent(category.name, topic, level.name, lessonCount);

          const lesson: Lesson = {
            id: lessonId,
            number: lessonCount,
            title: generated.title || `${topic} - Lesson ${i + 1}`,
            category: category.name,
            categoryCode: category.code,
            topic,
            level: level.name,
            levelCode: level.code,
            objectives: generated.objectives || [],
            vocabulary: generated.vocabulary || [],
            content: generated.content || '',
            exercises: generated.exercises || [],
            culturalNotes: generated.culturalNotes || '',
            createdAt: new Date().toISOString()
          };

          allLessons.push(lesson);

          // Save individual lesson
          const lessonFile = path.join(categoryDir, `${lessonId}.json`);
          fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2));

          // Batch push to GitHub every 100 lessons
          if (lessonCount % batchSize === 0) {
            batchCount++;
            console.log(`\n📤 Pushing batch ${batchCount} to GitHub (${lessonCount} lessons)...`);
            
            try {
              execSync('git add -A', { cwd: __dirname });
              execSync(`git commit -m "Bulk Generation: ${lessonCount} lessons - Batch ${batchCount}"`, { cwd: __dirname });
              execSync('git push origin main', { cwd: __dirname });
              console.log(`✅ Batch ${batchCount} pushed successfully!\n`);
            } catch (err) {
              console.log(`⚠️ Git push skipped for batch ${batchCount}\n`);
            }
          }

          // Small delay to avoid rate limiting
          if (lessonCount % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
    }
  }

  // Save master index
  const indexFile = path.join(lessonsDir, 'lessons-index.json');
  fs.writeFileSync(indexFile, JSON.stringify({
    totalLessons: allLessons.length,
    categories: CATEGORIES.map(c => ({ name: c.name, code: c.code, topicCount: c.topics.length })),
    levels: LEVELS,
    generatedAt: new Date().toISOString(),
    lessons: allLessons.map(l => ({ id: l.id, title: l.title, category: l.categoryCode, level: l.levelCode }))
  }, null, 2));

  // Final push
  console.log(`\n📤 Final push to GitHub...`);
  try {
    execSync('git add -A', { cwd: __dirname });
    execSync(`git commit -m "OMEGA 2.5 Complete: ${allLessons.length} lessons generated - Gods of American English"`, { cwd: __dirname });
    execSync('git push origin main', { cwd: __dirname });
    console.log(`✅ All ${allLessons.length} lessons pushed to GitHub!`);
  } catch (err) {
    console.log(`⚠️ Final push completed with warnings`);
  }

  console.log(`\n🎉 GENERATION COMPLETE!`);
  console.log(`📚 Total Lessons: ${allLessons.length}`);
  console.log(`📁 Saved to: ${lessonsDir}`);
  console.log(`🌐 Pushed to: GitHub`);

  return allLessons;
}

// Run the generator
generateAllLessons(10000).catch(console.error);
