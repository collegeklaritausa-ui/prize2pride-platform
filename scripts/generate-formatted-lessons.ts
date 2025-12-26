/**
 * Prize2Pride - Formatted Lesson Generator
 * Generates well-structured, comprehensive lessons for all levels
 * OMEGA777 2.5 - Creating Gods of American English
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI();

// Course structure definitions
const COURSE_LEVELS = [
  {
    code: 'A1',
    name: 'Foundation',
    description: 'Basic phrases, simple vocabulary, survival English',
    vocabularyTarget: 700,
    hoursTarget: 100,
  },
  {
    code: 'A2',
    name: 'Elementary',
    description: 'Everyday expressions, routine conversations',
    vocabularyTarget: 1200,
    hoursTarget: 120,
  },
  {
    code: 'B1',
    name: 'Intermediate',
    description: 'Independent communication, main points understanding',
    vocabularyTarget: 2500,
    hoursTarget: 180,
  },
  {
    code: 'B2',
    name: 'Upper-Intermediate',
    description: 'Fluent interaction, complex text comprehension',
    vocabularyTarget: 4000,
    hoursTarget: 200,
  },
  {
    code: 'C1',
    name: 'Advanced',
    description: 'Professional mastery, implicit meaning understanding',
    vocabularyTarget: 6000,
    hoursTarget: 250,
  },
  {
    code: 'C2',
    name: 'Mastery',
    description: 'Near-native proficiency, nuanced expression',
    vocabularyTarget: 8000,
    hoursTarget: 300,
  },
];

const UNIT_TOPICS = {
  A1: [
    { unit: 1, title: 'Hello, America!', topics: ['Alphabet', 'Greetings', 'Numbers', 'Days/Months', 'Time', 'Colors', 'Family', 'Objects', 'Present Tense', 'Questions'] },
    { unit: 2, title: 'Daily Life', topics: ['Morning Routines', 'Food & Meals', 'At Home', 'Weather', 'Clothing', 'Shopping', 'Transportation', 'Directions', 'Places', 'Activities'] },
    { unit: 3, title: 'About Me', topics: ['Personal Info', 'Hobbies', 'Likes/Dislikes', 'Abilities', 'Descriptions', 'Feelings', 'Health', 'Body Parts', 'Age', 'Nationality'] },
    { unit: 4, title: 'People & Places', topics: ['Jobs', 'Workplace', 'School', 'Neighborhood', 'City', 'Country', 'Buildings', 'Rooms', 'Furniture', 'Locations'] },
    { unit: 5, title: 'Time & Events', topics: ['Daily Schedule', 'Weekly Plans', 'Appointments', 'Holidays', 'Celebrations', 'Past Events', 'Future Plans', 'Seasons', 'Calendar', 'Frequency'] },
  ],
  A2: [
    { unit: 1, title: 'Expanding Communication', topics: ['Detailed Introductions', 'Describing People', 'Talking About Past', 'Making Plans', 'Giving Opinions', 'Agreeing/Disagreeing', 'Making Requests', 'Offering Help', 'Apologizing', 'Thanking'] },
    { unit: 2, title: 'Social Situations', topics: ['Making Friends', 'Invitations', 'Restaurant Dining', 'Phone Calls', 'Email Writing', 'Social Media', 'Parties', 'Small Talk', 'Compliments', 'Farewells'] },
    { unit: 3, title: 'Travel & Exploration', topics: ['Airport', 'Hotel', 'Sightseeing', 'Public Transport', 'Car Rental', 'Maps', 'Asking Directions', 'Tourist Info', 'Emergencies', 'Currency'] },
    { unit: 4, title: 'Work & Study', topics: ['Job Applications', 'Interviews', 'Office Life', 'Meetings', 'Presentations', 'Study Skills', 'Exams', 'Group Work', 'Deadlines', 'Goals'] },
    { unit: 5, title: 'Health & Lifestyle', topics: ['Doctor Visits', 'Pharmacy', 'Exercise', 'Diet', 'Sleep', 'Stress', 'Hobbies', 'Sports', 'Entertainment', 'Technology'] },
  ],
  B1: [
    { unit: 1, title: 'Effective Communication', topics: ['Storytelling', 'Explaining Ideas', 'Persuasion', 'Negotiation', 'Problem Solving', 'Decision Making', 'Giving Advice', 'Expressing Certainty', 'Speculation', 'Hypotheticals'] },
    { unit: 2, title: 'Professional English', topics: ['Business Meetings', 'Presentations', 'Report Writing', 'Email Etiquette', 'Networking', 'Customer Service', 'Complaints', 'Negotiations', 'Contracts', 'Marketing'] },
    { unit: 3, title: 'Academic Skills', topics: ['Research', 'Note-Taking', 'Essay Writing', 'Citations', 'Discussions', 'Debates', 'Critical Thinking', 'Analysis', 'Synthesis', 'Evaluation'] },
    { unit: 4, title: 'Media & Culture', topics: ['News Analysis', 'Film Discussion', 'Music', 'Art', 'Literature', 'Social Issues', 'Environment', 'Technology', 'Trends', 'Opinions'] },
    { unit: 5, title: 'Advanced Grammar', topics: ['Perfect Tenses', 'Conditionals', 'Passive Voice', 'Reported Speech', 'Relative Clauses', 'Modals', 'Gerunds/Infinitives', 'Phrasal Verbs', 'Collocations', 'Idioms'] },
  ],
  B2: [
    { unit: 1, title: 'Fluent Expression', topics: ['Nuanced Opinions', 'Abstract Ideas', 'Complex Arguments', 'Diplomatic Language', 'Hedging', 'Emphasis', 'Contrast', 'Cause/Effect', 'Comparison', 'Speculation'] },
    { unit: 2, title: 'Professional Mastery', topics: ['Leadership Communication', 'Strategic Planning', 'Project Management', 'Team Building', 'Conflict Resolution', 'Performance Reviews', 'Mentoring', 'Public Speaking', 'Media Relations', 'Crisis Communication'] },
    { unit: 3, title: 'Academic Excellence', topics: ['Thesis Development', 'Literature Review', 'Methodology', 'Data Analysis', 'Academic Writing', 'Peer Review', 'Conferences', 'Publications', 'Grant Writing', 'Research Ethics'] },
    { unit: 4, title: 'Cultural Fluency', topics: ['American History', 'Political System', 'Social Movements', 'Regional Cultures', 'Pop Culture', 'Sports Culture', 'Business Culture', 'Academic Culture', 'Media Landscape', 'Contemporary Issues'] },
    { unit: 5, title: 'Language Refinement', topics: ['Register Variation', 'Style Adaptation', 'Tone Control', 'Precision', 'Conciseness', 'Clarity', 'Coherence', 'Cohesion', 'Voice', 'Impact'] },
  ],
  C1: [
    { unit: 1, title: 'Expert Communication', topics: ['Sophisticated Arguments', 'Implicit Meaning', 'Irony/Sarcasm', 'Understatement', 'Rhetorical Devices', 'Persuasive Techniques', 'Negotiation Tactics', 'Mediation', 'Facilitation', 'Influence'] },
    { unit: 2, title: 'Executive English', topics: ['C-Suite Communication', 'Board Presentations', 'Investor Relations', 'Strategic Messaging', 'Change Management', 'Organizational Communication', 'Global Leadership', 'Cross-Cultural Management', 'Executive Presence', 'Thought Leadership'] },
    { unit: 3, title: 'Scholarly Discourse', topics: ['Advanced Research', 'Theoretical Frameworks', 'Methodological Debates', 'Peer Discourse', 'Academic Publishing', 'Conference Presentations', 'Grant Applications', 'Collaborative Research', 'Interdisciplinary Work', 'Knowledge Transfer'] },
    { unit: 4, title: 'Cultural Mastery', topics: ['Historical Context', 'Literary References', 'Cultural Allusions', 'Generational Differences', 'Subcultures', 'Media Criticism', 'Social Commentary', 'Political Discourse', 'Economic Language', 'Legal Language'] },
    { unit: 5, title: 'Stylistic Excellence', topics: ['Advanced Syntax', 'Lexical Sophistication', 'Pragmatic Competence', 'Discourse Management', 'Genre Mastery', 'Creative Expression', 'Technical Precision', 'Academic Style', 'Professional Polish', 'Personal Voice'] },
  ],
  C2: [
    { unit: 1, title: 'Native-Like Fluency', topics: ['Idiomatic Mastery', 'Colloquial Expertise', 'Slang Proficiency', 'Regional Variations', 'Generational Language', 'Professional Jargon', 'Technical Terminology', 'Academic Discourse', 'Literary Language', 'Poetic Expression'] },
    { unit: 2, title: 'Masterful Communication', topics: ['Eloquent Speaking', 'Compelling Writing', 'Persuasive Rhetoric', 'Diplomatic Finesse', 'Emotional Intelligence', 'Cultural Sensitivity', 'Contextual Adaptation', 'Audience Awareness', 'Impact Optimization', 'Legacy Building'] },
    { unit: 3, title: 'Professional Excellence', topics: ['Industry Leadership', 'Thought Innovation', 'Strategic Vision', 'Global Influence', 'Media Mastery', 'Crisis Leadership', 'Reputation Management', 'Stakeholder Engagement', 'Legacy Communication', 'Transformational Leadership'] },
    { unit: 4, title: 'Academic Distinction', topics: ['Original Research', 'Paradigm Shifting', 'Field Leadership', 'Mentorship Excellence', 'Publication Impact', 'Conference Keynotes', 'Policy Influence', 'Public Scholarship', 'Knowledge Creation', 'Academic Legacy'] },
    { unit: 5, title: 'Language Artistry', topics: ['Stylistic Virtuosity', 'Creative Mastery', 'Linguistic Innovation', 'Genre Transcendence', 'Cultural Contribution', 'Artistic Expression', 'Literary Achievement', 'Communicative Excellence', 'Lasting Impact', 'Eternal Mastery'] },
  ],
};

// Lesson template
interface FormattedLesson {
  id: string;
  unitNumber: number;
  lessonNumber: number;
  level: string;
  title: string;
  subtitle: string;
  duration: number;
  
  overview: {
    description: string;
    objectives: string[];
    prerequisites: string[];
    keySkills: string[];
  };
  
  warmUp: {
    title: string;
    activity: string;
    duration: number;
    instructions: string[];
  };
  
  presentation: {
    introduction: string;
    mainContent: {
      section: string;
      content: string;
      examples: { sentence: string; explanation: string }[];
      tips: string[];
    }[];
    visualAids: string[];
  };
  
  vocabulary: {
    word: string;
    pronunciation: string;
    partOfSpeech: string;
    definition: string;
    example: string;
    collocations: string[];
    synonyms: string[];
    antonyms: string[];
    register: 'formal' | 'neutral' | 'informal';
    frequency: 'high' | 'medium' | 'low';
  }[];
  
  grammar: {
    focus: string;
    explanation: string;
    formula: string;
    examples: { correct: string; incorrect?: string; explanation: string }[];
    exceptions: string[];
    practice: string[];
  } | null;
  
  practice: {
    exercises: {
      type: string;
      instructions: string;
      questions: {
        question: string;
        options?: string[];
        answer: string;
        explanation: string;
      }[];
      difficulty: 'easy' | 'medium' | 'hard';
    }[];
    interactiveActivities: {
      name: string;
      type: string;
      description: string;
      steps: string[];
      materials: string[];
    }[];
  };
  
  production: {
    speakingTask: {
      title: string;
      description: string;
      prompts: string[];
      evaluationCriteria: string[];
    };
    writingTask: {
      title: string;
      description: string;
      prompt: string;
      wordCount: { min: number; max: number };
      evaluationCriteria: string[];
    };
  };
  
  review: {
    keyPoints: string[];
    commonMistakes: { mistake: string; correction: string; explanation: string }[];
    selfAssessment: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
  
  extension: {
    additionalResources: { title: string; type: string; description: string }[];
    challengeActivities: string[];
    realWorldApplication: string;
    culturalNotes: string;
  };
  
  metadata: {
    avatarId: string;
    category: string;
    tags: string[];
    xpReward: number;
    estimatedCompletionTime: number;
    createdAt: string;
    version: string;
  };
}

// AI-powered lesson generation
async function generateLesson(
  level: string,
  unitNumber: number,
  lessonNumber: number,
  topic: string,
  unitTitle: string
): Promise<FormattedLesson> {
  const levelInfo = COURSE_LEVELS.find(l => l.code === level)!;
  
  const prompt = `Generate a comprehensive American English lesson with the following specifications:

Level: ${level} (${levelInfo.name}) - ${levelInfo.description}
Unit ${unitNumber}: ${unitTitle}
Lesson ${lessonNumber}: ${topic}

Create a detailed, well-formatted lesson that transforms learners into confident English speakers. The lesson should be engaging, practical, and culturally relevant to American English.

Return a JSON object with this exact structure:
{
  "title": "Engaging lesson title",
  "subtitle": "Brief descriptive subtitle",
  "duration": 60,
  "overview": {
    "description": "2-3 sentence lesson description",
    "objectives": ["5 specific, measurable learning objectives"],
    "prerequisites": ["2-3 prerequisites"],
    "keySkills": ["3-4 key skills developed"]
  },
  "warmUp": {
    "title": "Warm-up activity name",
    "activity": "Description of warm-up",
    "duration": 5,
    "instructions": ["Step-by-step instructions"]
  },
  "presentation": {
    "introduction": "Engaging introduction paragraph",
    "mainContent": [
      {
        "section": "Section title",
        "content": "Detailed explanation",
        "examples": [{"sentence": "Example", "explanation": "Why it works"}],
        "tips": ["Practical tips"]
      }
    ],
    "visualAids": ["Descriptions of helpful visuals"]
  },
  "vocabulary": [
    {
      "word": "vocabulary word",
      "pronunciation": "/IPA/",
      "partOfSpeech": "noun/verb/etc",
      "definition": "Clear definition",
      "example": "Example sentence",
      "collocations": ["common word pairs"],
      "synonyms": ["similar words"],
      "antonyms": ["opposite words"],
      "register": "formal/neutral/informal",
      "frequency": "high/medium/low"
    }
  ],
  "grammar": {
    "focus": "Grammar point",
    "explanation": "Clear explanation",
    "formula": "Structure formula",
    "examples": [{"correct": "Correct example", "incorrect": "Wrong example", "explanation": "Why"}],
    "exceptions": ["Notable exceptions"],
    "practice": ["Practice sentences"]
  },
  "practice": {
    "exercises": [
      {
        "type": "multiple_choice/fill_blank/matching",
        "instructions": "Clear instructions",
        "questions": [{"question": "Q", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "Why"}],
        "difficulty": "easy/medium/hard"
      }
    ],
    "interactiveActivities": [
      {
        "name": "Activity name",
        "type": "role-play/discussion/game",
        "description": "What students do",
        "steps": ["Step-by-step"],
        "materials": ["Needed materials"]
      }
    ]
  },
  "production": {
    "speakingTask": {
      "title": "Speaking task name",
      "description": "Task description",
      "prompts": ["Speaking prompts"],
      "evaluationCriteria": ["How to evaluate"]
    },
    "writingTask": {
      "title": "Writing task name",
      "description": "Task description",
      "prompt": "Writing prompt",
      "wordCount": {"min": 50, "max": 100},
      "evaluationCriteria": ["Evaluation criteria"]
    }
  },
  "review": {
    "keyPoints": ["5 key takeaways"],
    "commonMistakes": [{"mistake": "Common error", "correction": "Correct form", "explanation": "Why"}],
    "selfAssessment": [{"question": "Self-check question", "options": ["A", "B", "C", "D"], "correctAnswer": 0}]
  },
  "extension": {
    "additionalResources": [{"title": "Resource", "type": "video/article/app", "description": "Brief description"}],
    "challengeActivities": ["Advanced activities"],
    "realWorldApplication": "How to use this in real life",
    "culturalNotes": "American cultural context and tips"
  }
}

Include 8-10 vocabulary words appropriate for ${level} level.
Include 5-8 practice exercises of varying difficulty.
Make all content specifically relevant to American English and culture.
Ensure the lesson is engaging, practical, and builds toward fluency.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert American English curriculum designer creating comprehensive, well-formatted lessons. Return only valid JSON without markdown code blocks.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const lessonData = JSON.parse(cleanContent);

    // Construct the full lesson object
    const lesson: FormattedLesson = {
      id: `${level}-U${unitNumber}-L${lessonNumber}`,
      unitNumber,
      lessonNumber,
      level,
      title: lessonData.title || `${topic} - Lesson ${lessonNumber}`,
      subtitle: lessonData.subtitle || `Unit ${unitNumber}: ${unitTitle}`,
      duration: lessonData.duration || 60,
      overview: lessonData.overview || {
        description: `Comprehensive lesson on ${topic}`,
        objectives: [`Master ${topic} concepts`],
        prerequisites: [],
        keySkills: [],
      },
      warmUp: lessonData.warmUp || {
        title: 'Quick Review',
        activity: 'Review previous concepts',
        duration: 5,
        instructions: ['Think about what you learned last time'],
      },
      presentation: lessonData.presentation || {
        introduction: `Welcome to this lesson on ${topic}`,
        mainContent: [],
        visualAids: [],
      },
      vocabulary: lessonData.vocabulary || [],
      grammar: lessonData.grammar || null,
      practice: lessonData.practice || {
        exercises: [],
        interactiveActivities: [],
      },
      production: lessonData.production || {
        speakingTask: {
          title: 'Speaking Practice',
          description: 'Practice speaking about the topic',
          prompts: [],
          evaluationCriteria: [],
        },
        writingTask: {
          title: 'Writing Practice',
          description: 'Practice writing about the topic',
          prompt: '',
          wordCount: { min: 50, max: 150 },
          evaluationCriteria: [],
        },
      },
      review: lessonData.review || {
        keyPoints: [],
        commonMistakes: [],
        selfAssessment: [],
      },
      extension: lessonData.extension || {
        additionalResources: [],
        challengeActivities: [],
        realWorldApplication: '',
        culturalNotes: '',
      },
      metadata: {
        avatarId: getAvatarForLevel(level),
        category: unitTitle,
        tags: [level, topic, unitTitle],
        xpReward: getXpReward(level),
        estimatedCompletionTime: lessonData.duration || 60,
        createdAt: new Date().toISOString(),
        version: '2.0',
      },
    };

    return lesson;
  } catch (error) {
    console.error(`Error generating lesson ${level}-U${unitNumber}-L${lessonNumber}:`, error);
    // Return a template lesson on error
    return createTemplatelesson(level, unitNumber, lessonNumber, topic, unitTitle);
  }
}

function getAvatarForLevel(level: string): string {
  const avatars: Record<string, string> = {
    A1: 'tutor-lily',
    A2: 'tutor-lily',
    B1: 'coach-sophia',
    B2: 'mentor-olivia',
    C1: 'professor-emma',
    C2: 'professor-emma',
  };
  return avatars[level] || 'guide-maya';
}

function getXpReward(level: string): number {
  const rewards: Record<string, number> = {
    A1: 50, A2: 60, B1: 75, B2: 90, C1: 100, C2: 120,
  };
  return rewards[level] || 50;
}

function createTemplatelesson(
  level: string,
  unitNumber: number,
  lessonNumber: number,
  topic: string,
  unitTitle: string
): FormattedLesson {
  return {
    id: `${level}-U${unitNumber}-L${lessonNumber}`,
    unitNumber,
    lessonNumber,
    level,
    title: `${topic}`,
    subtitle: `Unit ${unitNumber}: ${unitTitle}`,
    duration: 60,
    overview: {
      description: `This lesson covers ${topic} at the ${level} level, helping you build essential American English skills.`,
      objectives: [
        `Understand key concepts of ${topic}`,
        `Apply ${topic} in practical situations`,
        `Build confidence using ${topic} in conversation`,
        `Recognize common patterns and expressions`,
        `Practice through interactive exercises`,
      ],
      prerequisites: ['Completion of previous lessons', 'Basic understanding of prior concepts'],
      keySkills: ['Listening', 'Speaking', 'Reading', 'Writing'],
    },
    warmUp: {
      title: 'Quick Activation',
      activity: `Think about your experience with ${topic}`,
      duration: 5,
      instructions: [
        'Take a moment to recall related vocabulary',
        'Think of situations where you might use this',
        'Prepare questions you have about the topic',
      ],
    },
    presentation: {
      introduction: `Welcome to this lesson on ${topic}. By the end of this session, you will have a solid understanding of how to use these concepts in real American English conversations.`,
      mainContent: [
        {
          section: 'Core Concepts',
          content: `Let's explore the fundamental aspects of ${topic} in American English.`,
          examples: [
            { sentence: 'Example sentence demonstrating the concept.', explanation: 'This shows how native speakers use this in everyday conversation.' },
          ],
          tips: ['Practice regularly', 'Listen to native speakers', 'Don\'t be afraid to make mistakes'],
        },
      ],
      visualAids: ['Diagrams showing key relationships', 'Charts comparing usage patterns'],
    },
    vocabulary: [],
    grammar: null,
    practice: {
      exercises: [],
      interactiveActivities: [
        {
          name: 'Partner Practice',
          type: 'role-play',
          description: `Practice using ${topic} with a partner`,
          steps: ['Review the key expressions', 'Take turns practicing', 'Give each other feedback'],
          materials: ['Lesson vocabulary list', 'Practice prompts'],
        },
      ],
    },
    production: {
      speakingTask: {
        title: 'Real-World Speaking',
        description: `Use ${topic} in a realistic scenario`,
        prompts: ['Describe a situation using the lesson vocabulary', 'Explain your thoughts on the topic'],
        evaluationCriteria: ['Accuracy', 'Fluency', 'Appropriate vocabulary use'],
      },
      writingTask: {
        title: 'Written Expression',
        description: `Write about ${topic}`,
        prompt: `Write a short paragraph using the vocabulary and concepts from this lesson.`,
        wordCount: { min: 50, max: 150 },
        evaluationCriteria: ['Grammar accuracy', 'Vocabulary usage', 'Coherence'],
      },
    },
    review: {
      keyPoints: [
        `Key concept 1 about ${topic}`,
        `Key concept 2 about ${topic}`,
        `Key concept 3 about ${topic}`,
      ],
      commonMistakes: [],
      selfAssessment: [],
    },
    extension: {
      additionalResources: [],
      challengeActivities: ['Advanced practice with native content'],
      realWorldApplication: `Use these skills in everyday American English conversations.`,
      culturalNotes: `Understanding ${topic} is important for effective communication in American culture.`,
    },
    metadata: {
      avatarId: getAvatarForLevel(level),
      category: unitTitle,
      tags: [level, topic, unitTitle],
      xpReward: getXpReward(level),
      estimatedCompletionTime: 60,
      createdAt: new Date().toISOString(),
      version: '2.0',
    },
  };
}

// Main generation function
async function generateAllLessons() {
  const outputDir = path.join(__dirname, '..', 'courses');
  
  console.log('🚀 Starting comprehensive lesson generation...');
  console.log(`📁 Output directory: ${outputDir}`);
  
  let totalGenerated = 0;
  
  for (const level of COURSE_LEVELS) {
    const levelDir = path.join(outputDir, `${level.code}-${level.name}`, 'lessons');
    
    if (!fs.existsSync(levelDir)) {
      fs.mkdirSync(levelDir, { recursive: true });
    }
    
    const units = UNIT_TOPICS[level.code as keyof typeof UNIT_TOPICS];
    
    for (const unit of units) {
      console.log(`\n📚 Generating ${level.code} Unit ${unit.unit}: ${unit.title}`);
      
      for (let i = 0; i < unit.topics.length; i++) {
        const topic = unit.topics[i];
        const lessonNumber = i + 1;
        
        console.log(`  📝 Lesson ${lessonNumber}: ${topic}`);
        
        const lesson = await generateLesson(
          level.code,
          unit.unit,
          lessonNumber,
          topic,
          unit.title
        );
        
        const filename = `${lesson.id}.json`;
        const filepath = path.join(levelDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(lesson, null, 2));
        totalGenerated++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  
  console.log(`\n✅ Generation complete!`);
  console.log(`📊 Total lessons generated: ${totalGenerated}`);
}

// Export for use
export { generateLesson, generateAllLessons, FormattedLesson };

// Run if executed directly
generateAllLessons().catch(console.error);
