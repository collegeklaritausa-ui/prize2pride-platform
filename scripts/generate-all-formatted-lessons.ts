/**
 * Comprehensive Lesson Generator for Prize2Pride Platform
 * Generates ALL lessons with proper HTML formatting, bilingual support, and exercises
 * 
 * Marketed by CodinCloud - Turning Ideas into Sophisticated Platforms
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Course structure with all levels and units
const courseStructure = {
  A1: {
    name: "Foundation",
    units: [
      { number: 1, title: "Hello, America!", topics: ["Alphabet & Pronunciation", "Greetings & Introductions", "Numbers 1-100", "Days & Months", "Telling Time", "Colors & Descriptions", "Family Members", "Common Objects", "Basic Verbs - Present", "Questions & Answers"] },
      { number: 2, title: "Daily Life", topics: ["Morning Routines", "Food & Meals", "At Home", "Weather & Seasons", "Clothing & Shopping", "Transportation", "Asking Directions", "Places in City", "Daily Activities", "Weekend Plans"] },
      { number: 3, title: "About Me", topics: ["Personal Information", "Hobbies & Interests", "Likes & Dislikes", "Abilities with Can", "Physical Descriptions", "Feelings & Emotions", "Health & Body", "Age & Birthday", "Nationality & Origin", "Self Introduction"] },
      { number: 4, title: "People & Places", topics: ["Jobs & Occupations", "The Workplace", "School & Education", "My Neighborhood", "The City", "Countries & Cultures", "Buildings & Structures", "Rooms & Furniture", "Prepositions of Place", "Describing Locations"] },
      { number: 5, title: "Time & Events", topics: ["Daily Schedules", "Weekly Planning", "Making Appointments", "American Holidays", "Celebrations & Parties", "Simple Past Tense", "Future with Going To", "Seasons & Activities", "Using Calendar", "Frequency Adverbs"] }
    ]
  },
  A2: {
    name: "Elementary",
    units: [
      { number: 1, title: "Expanding Communication", topics: ["Past Tense Regular", "Past Tense Irregular", "Comparatives", "Superlatives", "Adverbs of Manner", "Conjunctions", "Prepositions of Time", "Question Words", "Reported Speech Intro", "Modal Verbs Basics"] },
      { number: 2, title: "Social Situations", topics: ["Making Friends", "Phone Conversations", "Email Writing", "Social Media English", "Invitations", "Apologies & Excuses", "Giving Advice", "Making Suggestions", "Agreeing & Disagreeing", "Small Talk"] },
      { number: 3, title: "Travel & Tourism", topics: ["At the Airport", "Hotel Check-in", "Restaurant Ordering", "Asking for Help", "Public Transportation", "Tourist Attractions", "Taking Photos", "Souvenirs & Shopping", "Travel Problems", "Describing Experiences"] },
      { number: 4, title: "Health & Wellness", topics: ["Body Parts Advanced", "Common Illnesses", "Doctor Visits", "Pharmacy & Medicine", "Healthy Lifestyle", "Exercise & Sports", "Mental Health Basics", "Emergency Situations", "First Aid", "Health Insurance"] },
      { number: 5, title: "Work & Career", topics: ["Job Applications", "Resume Writing", "Job Interviews", "Workplace Vocabulary", "Office Equipment", "Meetings Basics", "Work Schedules", "Colleagues & Teams", "Professional Email", "Career Goals"] }
    ]
  },
  B1: {
    name: "Intermediate",
    units: [
      { number: 1, title: "Advanced Grammar", topics: ["Present Perfect Continuous", "Past Perfect", "Future Perfect", "Conditionals Type 1", "Conditionals Type 2", "Passive Voice", "Relative Clauses", "Gerunds & Infinitives", "Phrasal Verbs Common", "Reported Speech Advanced"] },
      { number: 2, title: "Media & Entertainment", topics: ["Movies & TV Shows", "Music & Concerts", "Books & Literature", "News & Journalism", "Social Media Trends", "Podcasts & Radio", "Video Games", "Celebrity Culture", "Reviews & Opinions", "Entertainment Industry"] },
      { number: 3, title: "Environment & Nature", topics: ["Climate Change", "Recycling & Waste", "Wildlife & Conservation", "Natural Disasters", "Renewable Energy", "Pollution Issues", "Sustainable Living", "National Parks", "Ocean & Marine Life", "Environmental Activism"] },
      { number: 4, title: "Technology & Innovation", topics: ["Smartphones & Apps", "Internet & Web", "Artificial Intelligence", "Social Networks", "Online Security", "E-commerce", "Smart Home Devices", "Future Technology", "Digital Communication", "Tech Companies"] },
      { number: 5, title: "Culture & Society", topics: ["American Culture", "Cultural Differences", "Traditions & Customs", "Immigration Stories", "Social Issues", "Diversity & Inclusion", "Generation Gaps", "Urban vs Rural", "American Dream", "Cultural Events"] }
    ]
  },
  B2: {
    name: "Upper-Intermediate",
    units: [
      { number: 1, title: "Complex Grammar", topics: ["Conditionals Type 3", "Mixed Conditionals", "Inversion", "Cleft Sentences", "Ellipsis & Substitution", "Advanced Passive", "Causative Have/Get", "Subjunctive Mood", "Emphasis Structures", "Complex Sentences"] },
      { number: 2, title: "Business English", topics: ["Corporate Culture", "Negotiations", "Presentations", "Business Writing", "Financial Terms", "Marketing Language", "Leadership & Management", "Networking", "Business Ethics", "Global Business"] },
      { number: 3, title: "Academic English", topics: ["Essay Writing", "Research Methods", "Academic Vocabulary", "Citations & References", "Critical Thinking", "Debate & Argumentation", "Lecture Comprehension", "Note-Taking Skills", "Academic Presentations", "Thesis Development"] },
      { number: 4, title: "Current Affairs", topics: ["Political Systems", "Economic Issues", "International Relations", "Human Rights", "Healthcare Systems", "Education Reform", "Immigration Policy", "Criminal Justice", "Media Influence", "Global Challenges"] },
      { number: 5, title: "Professional Development", topics: ["Career Advancement", "Leadership Skills", "Public Speaking", "Time Management", "Conflict Resolution", "Emotional Intelligence", "Professional Networking", "Personal Branding", "Work-Life Balance", "Mentorship"] }
    ]
  },
  C1: {
    name: "Advanced",
    units: [
      { number: 1, title: "Linguistic Mastery", topics: ["Nuanced Grammar", "Idiomatic Expressions", "Collocations Advanced", "Register & Style", "Discourse Markers", "Hedging Language", "Emphatic Structures", "Literary Devices", "Rhetorical Techniques", "Language Evolution"] },
      { number: 2, title: "Professional Excellence", topics: ["Executive Communication", "Strategic Planning", "Crisis Management", "Corporate Governance", "Mergers & Acquisitions", "International Law Basics", "Intellectual Property", "Stakeholder Management", "Change Management", "Innovation Leadership"] },
      { number: 3, title: "Academic Excellence", topics: ["Research Methodology", "Statistical Analysis", "Literature Review", "Peer Review Process", "Grant Writing", "Conference Presentations", "Publishing Papers", "Academic Collaboration", "Interdisciplinary Studies", "Ethical Research"] },
      { number: 4, title: "Specialized Fields", topics: ["Medical English", "Legal English", "Technical Writing", "Scientific Communication", "Financial Analysis", "Engineering Terms", "IT & Computing", "Architecture & Design", "Psychology Terms", "Environmental Science"] },
      { number: 5, title: "Cultural Fluency", topics: ["American Humor", "Regional Dialects", "Historical References", "Pop Culture Deep Dive", "Political Discourse", "Social Commentary", "Artistic Expression", "Philosophical Concepts", "Literary Analysis", "Cultural Criticism"] }
    ]
  },
  C2: {
    name: "Mastery",
    units: [
      { number: 1, title: "Native-Level Grammar", topics: ["Subtle Grammar Points", "Stylistic Variation", "Archaic & Formal Forms", "Colloquial Structures", "Regional Variations", "Written vs Spoken", "Poetic License", "Grammar in Context", "Prescriptive vs Descriptive", "Language Change"] },
      { number: 2, title: "Eloquent Expression", topics: ["Persuasive Writing", "Speechwriting", "Creative Writing", "Journalistic Style", "Academic Publishing", "Technical Documentation", "Legal Drafting", "Marketing Copy", "Screenplay Writing", "Poetry & Prose"] },
      { number: 3, title: "Thought Leadership", topics: ["Public Intellectual", "Opinion Leadership", "Media Appearances", "Keynote Speaking", "Panel Discussions", "Podcast Hosting", "Blog & Vlog Creation", "Social Commentary", "Influencer Communication", "Thought Pieces"] },
      { number: 4, title: "Cross-Cultural Mastery", topics: ["Intercultural Negotiation", "Diplomatic Language", "Cultural Intelligence", "Global Leadership", "Multicultural Teams", "Cross-Border Communication", "Cultural Adaptation", "International Etiquette", "Global Citizenship", "Cultural Bridge-Building"] },
      { number: 5, title: "Language Artistry", topics: ["Metaphor & Symbolism", "Narrative Techniques", "Voice & Tone Mastery", "Audience Adaptation", "Contextual Fluency", "Improvisation Skills", "Wit & Wordplay", "Emotional Resonance", "Memorable Communication", "Legacy & Impact"] }
    ]
  }
};

// Arabic translations for common terms
const arabicTranslations: Record<string, string> = {
  "Alphabet & Pronunciation": "الأبجدية والنطق",
  "Greetings & Introductions": "التحيات والتعارف",
  "Numbers 1-100": "الأرقام من 1 إلى 100",
  "Days & Months": "الأيام والشهور",
  "Telling Time": "قراءة الوقت",
  "Colors & Descriptions": "الألوان والأوصاف",
  "Family Members": "أفراد العائلة",
  "Common Objects": "الأشياء الشائعة",
  "Basic Verbs - Present": "الأفعال الأساسية - المضارع",
  "Questions & Answers": "الأسئلة والأجوبة",
  "Morning Routines": "الروتين الصباحي",
  "Food & Meals": "الطعام والوجبات",
  "At Home": "في المنزل",
  "Weather & Seasons": "الطقس والفصول",
  "Clothing & Shopping": "الملابس والتسوق",
  "Transportation": "المواصلات",
  "Asking Directions": "السؤال عن الاتجاهات",
  "Places in City": "الأماكن في المدينة",
  "Daily Activities": "الأنشطة اليومية",
  "Weekend Plans": "خطط نهاية الأسبوع",
  // Add more as needed
};

// Lesson content templates by category
const lessonTemplates: Record<string, (topic: string, level: string, arabicTopic: string) => string> = {
  grammar: (topic, level, arabicTopic) => `<h2 style="color:#2c3e50;">🎓 ${topic}</h2>

<hr>

<h3 style="color:#1f618d;">📌 Learning Objectives</h3>
<ul>
  <li><b>Understand</b> the core concepts of ${topic} in American English.</li>
  <li><b>Apply</b> ${topic} correctly in speaking and writing.</li>
  <li><b>Recognize</b> common patterns and usage in real conversations.</li>
  <li><b>Practice</b> through interactive exercises and examples.</li>
</ul>

<p style="color:#154360;">
<b>الأهداف التعليمية:</b><br>
فهم المفاهيم الأساسية لـ ${arabicTopic} في الإنجليزية الأمريكية وتطبيقها بشكل صحيح.
</p>

<hr>

<h3 style="color:#1f618d;">📘 Core Content</h3>

<p style="color:#8b0000;">
<b>Explanation:</b> In American English, mastering ${topic} is essential for clear communication.
This lesson will guide you through the key concepts and practical applications.
</p>

<p style="color:#154360;">
<b>الشرح بالعربية:</b><br>
إتقان ${arabicTopic} ضروري للتواصل الواضح في الإنجليزية الأمريكية.
</p>

<hr>

<h3 style="color:#2874a6;">📝 Key Points</h3>
<ul>
  <li><b>Point 1:</b> Understanding the basic structure and rules.</li>
  <li><b>Point 2:</b> Common usage patterns in everyday conversation.</li>
  <li><b>Point 3:</b> Exceptions and special cases to remember.</li>
  <li><b>Point 4:</b> Practice strategies for mastery.</li>
</ul>

<hr>

<h3 style="color:#1f618d;">✍️ Example Sentences</h3>
<ul>
  <li><b>Example 1:</b> <i>This demonstrates the concept in action.</i></li>
  <li><b>Example 2:</b> <i>Here's another practical application.</i></li>
  <li><b>Example 3:</b> <i>Notice how native speakers use this naturally.</i></li>
</ul>

<hr>

<h3 style="color:#1f618d;">🧠 Pro Tips</h3>
<p style="color:#8b0000;">
<b>Remember:</b> Practice makes perfect! Use these structures in your daily conversations
to build muscle memory and confidence.
</p>`,

  vocabulary: (topic, level, arabicTopic) => `<h2 style="color:#2c3e50;">📚 ${topic}</h2>

<hr>

<h3 style="color:#1f618d;">📌 Learning Objectives</h3>
<ul>
  <li><b>Learn</b> essential vocabulary related to ${topic}.</li>
  <li><b>Understand</b> proper pronunciation and usage.</li>
  <li><b>Apply</b> new words in context through examples.</li>
  <li><b>Build</b> your vocabulary foundation for fluent communication.</li>
</ul>

<p style="color:#154360;">
<b>الأهداف التعليمية:</b><br>
تعلم المفردات الأساسية المتعلقة بـ ${arabicTopic} وفهم النطق الصحيح والاستخدام.
</p>

<hr>

<h3 style="color:#1f618d;">📘 Vocabulary List</h3>

<p style="color:#8b0000;">
<b>Introduction:</b> This lesson covers essential vocabulary for ${topic}.
Each word includes pronunciation guidance, definition, and example sentences.
</p>

<hr>

<h3 style="color:#2874a6;">🔤 Key Words & Phrases</h3>

<p>Master these essential terms to communicate effectively about ${topic}:</p>

<ul>
  <li><b>Word 1:</b> Definition and example usage in American English.</li>
  <li><b>Word 2:</b> Definition and example usage in American English.</li>
  <li><b>Word 3:</b> Definition and example usage in American English.</li>
  <li><b>Word 4:</b> Definition and example usage in American English.</li>
  <li><b>Word 5:</b> Definition and example usage in American English.</li>
</ul>

<hr>

<h3 style="color:#1f618d;">💬 Common Expressions</h3>
<ul>
  <li><b>Expression 1:</b> <i>Used in everyday American conversation.</i></li>
  <li><b>Expression 2:</b> <i>A natural way to express this idea.</i></li>
  <li><b>Expression 3:</b> <i>Commonly heard in American media.</i></li>
</ul>`,

  conversation: (topic, level, arabicTopic) => `<h2 style="color:#2c3e50;">💬 ${topic}</h2>

<hr>

<h3 style="color:#1f618d;">📌 Learning Objectives</h3>
<ul>
  <li><b>Practice</b> real-world conversations about ${topic}.</li>
  <li><b>Learn</b> natural expressions and responses.</li>
  <li><b>Build</b> confidence in speaking situations.</li>
  <li><b>Understand</b> cultural context in American communication.</li>
</ul>

<p style="color:#154360;">
<b>الأهداف التعليمية:</b><br>
ممارسة المحادثات الواقعية حول ${arabicTopic} وتعلم التعبيرات الطبيعية.
</p>

<hr>

<h3 style="color:#1f618d;">📘 Dialogue Practice</h3>

<p style="color:#8b0000;">
<b>Scenario:</b> Practice this conversation to improve your ${topic} skills.
Pay attention to natural expressions and responses.
</p>

<hr>

<h3 style="color:#2874a6;">🎭 Sample Conversation</h3>

<p><b>Person A:</b> <i>"Opening line demonstrating the topic..."</i></p>
<p><b>Person B:</b> <i>"Natural response in American English..."</i></p>
<p><b>Person A:</b> <i>"Follow-up question or comment..."</i></p>
<p><b>Person B:</b> <i>"Appropriate reply with useful expression..."</i></p>

<hr>

<h3 style="color:#1f618d;">🗣️ Useful Phrases</h3>
<ul>
  <li><b>Starting a conversation:</b> <i>"Hey, do you have a minute?"</i></li>
  <li><b>Asking for clarification:</b> <i>"Could you explain that again?"</i></li>
  <li><b>Expressing agreement:</b> <i>"That makes total sense!"</i></li>
  <li><b>Polite closing:</b> <i>"It was great talking to you!"</i></li>
</ul>`,

  culture: (topic, level, arabicTopic) => `<h2 style="color:#2c3e50;">🌎 ${topic}</h2>

<hr>

<h3 style="color:#1f618d;">📌 Learning Objectives</h3>
<ul>
  <li><b>Understand</b> American cultural aspects of ${topic}.</li>
  <li><b>Learn</b> appropriate behavior and expressions.</li>
  <li><b>Appreciate</b> cultural differences and similarities.</li>
  <li><b>Apply</b> cultural knowledge in real situations.</li>
</ul>

<p style="color:#154360;">
<b>الأهداف التعليمية:</b><br>
فهم الجوانب الثقافية الأمريكية لـ ${arabicTopic} وتعلم السلوك والتعبيرات المناسبة.
</p>

<hr>

<h3 style="color:#1f618d;">📘 Cultural Insights</h3>

<p style="color:#8b0000;">
<b>Overview:</b> Understanding ${topic} in American culture helps you communicate
more effectively and avoid misunderstandings.
</p>

<hr>

<h3 style="color:#2874a6;">🇺🇸 American Perspective</h3>

<p>In American culture, ${topic} plays an important role in daily life.
Here are key points to understand:</p>

<ul>
  <li><b>Cultural norm 1:</b> How Americans typically approach this.</li>
  <li><b>Cultural norm 2:</b> Common expectations and behaviors.</li>
  <li><b>Cultural norm 3:</b> What to do and what to avoid.</li>
</ul>

<hr>

<h3 style="color:#1f618d;">💡 Cultural Tips</h3>
<p style="color:#8b0000;">
<b>Pro Tip:</b> When in doubt, observe how native speakers handle similar situations.
Americans generally appreciate when non-native speakers make an effort to understand their culture.
</p>`
};

// Generate vocabulary items for a topic
function generateVocabulary(topic: string, level: string): any[] {
  const vocabCount = level === 'A1' ? 5 : level === 'A2' ? 6 : level === 'B1' ? 7 : level === 'B2' ? 8 : 10;
  const vocabulary = [];
  
  for (let i = 1; i <= vocabCount; i++) {
    vocabulary.push({
      word: `${topic} Term ${i}`,
      definition: `Definition for vocabulary term ${i} related to ${topic}.`,
      example: `This is an example sentence using term ${i} in context.`,
      translation: `ترجمة المصطلح ${i}`
    });
  }
  
  return vocabulary;
}

// Generate exercises for a lesson
function generateExercises(topic: string, level: string): any[] {
  const exercises = [];
  const exerciseCount = level === 'A1' ? 3 : level === 'A2' ? 4 : level === 'B1' ? 5 : 6;
  
  // Multiple choice
  exercises.push({
    id: 1,
    type: "multiple_choice",
    question: `Which statement best describes ${topic}?`,
    options: [
      "Option A - Correct answer",
      "Option B - Incorrect",
      "Option C - Incorrect",
      "Option D - Incorrect"
    ],
    correctAnswer: 0,
    explanation: `The correct answer demonstrates understanding of ${topic}.`,
    xpReward: 10
  });
  
  // Fill in the blank
  exercises.push({
    id: 2,
    type: "fill_blank",
    question: `Complete the sentence: "In American English, we use ___ when discussing ${topic}."`,
    correctAnswer: "appropriate term",
    explanation: "This shows proper usage in context.",
    xpReward: 10
  });
  
  // True/False
  exercises.push({
    id: 3,
    type: "true_false",
    question: `True or False: ${topic} is commonly used in everyday American conversation.`,
    correctAnswer: true,
    explanation: "This is a fundamental aspect of American English.",
    xpReward: 10
  });
  
  if (exerciseCount > 3) {
    exercises.push({
      id: 4,
      type: "matching",
      question: "Match the terms with their definitions.",
      pairs: [
        { term: "Term 1", definition: "Definition 1" },
        { term: "Term 2", definition: "Definition 2" },
        { term: "Term 3", definition: "Definition 3" }
      ],
      xpReward: 15
    });
  }
  
  if (exerciseCount > 4) {
    exercises.push({
      id: 5,
      type: "speaking",
      question: `Describe ${topic} using at least three complete sentences.`,
      sampleAnswer: `Sample answer demonstrating proper usage of ${topic} in American English.`,
      xpReward: 20
    });
  }
  
  if (exerciseCount > 5) {
    exercises.push({
      id: 6,
      type: "writing",
      question: `Write a short paragraph about ${topic} (50-100 words).`,
      rubric: ["Grammar accuracy", "Vocabulary usage", "Coherence", "Topic relevance"],
      xpReward: 25
    });
  }
  
  return exercises;
}

// Determine lesson category based on topic
function getLessonCategory(topic: string): string {
  const grammarKeywords = ['tense', 'verb', 'grammar', 'conditional', 'passive', 'clause', 'sentence', 'modal', 'preposition', 'conjunction', 'adverb'];
  const vocabKeywords = ['vocabulary', 'words', 'terms', 'expressions', 'phrases', 'numbers', 'colors', 'family', 'food', 'body', 'clothes'];
  const cultureKeywords = ['culture', 'american', 'holiday', 'tradition', 'custom', 'social', 'etiquette'];
  
  const topicLower = topic.toLowerCase();
  
  if (grammarKeywords.some(kw => topicLower.includes(kw))) return 'grammar';
  if (cultureKeywords.some(kw => topicLower.includes(kw))) return 'culture';
  if (vocabKeywords.some(kw => topicLower.includes(kw))) return 'vocabulary';
  return 'conversation';
}

// Generate a single formatted lesson
function generateFormattedLesson(
  level: string,
  levelName: string,
  unitNumber: number,
  unitTitle: string,
  lessonNumber: number,
  topic: string
): any {
  const lessonId = `${level}-U${unitNumber}-L${lessonNumber}`;
  const category = getLessonCategory(topic);
  const arabicTopic = arabicTranslations[topic] || topic;
  const template = lessonTemplates[category] || lessonTemplates.conversation;
  
  const xpReward = level === 'A1' ? 50 : level === 'A2' ? 60 : level === 'B1' ? 75 : level === 'B2' ? 90 : level === 'C1' ? 100 : 120;
  const duration = level === 'A1' ? 45 : level === 'A2' ? 50 : level === 'B1' ? 55 : level === 'B2' ? 60 : 70;
  
  return {
    id: lessonId,
    level: level,
    unitNumber: unitNumber,
    lessonNumber: lessonNumber,
    title: topic,
    subtitle: `Unit ${unitNumber}: ${unitTitle}`,
    duration: duration,
    xpReward: xpReward,
    avatarId: "nova",
    category: category,
    objectives: [
      `<b>Understand</b> the key concepts of ${topic} in American English.`,
      `<b>Apply</b> ${topic} correctly in real-world situations.`,
      `<b>Practice</b> through interactive exercises and examples.`,
      `<b>Build confidence</b> using ${topic} in conversation.`,
      `<b>Master</b> common patterns and expressions.`
    ],
    objectivesArabic: `فهم المفاهيم الأساسية لـ ${arabicTopic} في الإنجليزية الأمريكية وتطبيقها بشكل صحيح.`,
    content: template(topic, level, arabicTopic),
    culturalNotes: `<p style="color:#8b0000;">
<b>Cultural Context:</b> In American culture, understanding ${topic} helps you communicate more naturally and effectively.
Americans appreciate when non-native speakers make an effort to use language appropriately.
</p>

<p style="color:#154360;">
<b>السياق الثقافي:</b><br>
في الثقافة الأمريكية، فهم ${arabicTopic} يساعدك على التواصل بشكل طبيعي وفعال.
</p>`,
    vocabulary: generateVocabulary(topic, level),
    materials: [
      "Interactive exercises",
      "Audio pronunciation guides",
      "Practice dialogues",
      "Cultural notes",
      "Bilingual explanations (EN/AR)"
    ],
    exercises: generateExercises(topic, level),
    metadata: {
      createdAt: new Date().toISOString(),
      version: "3.0",
      author: "Prize2Pride Platform",
      marketedBy: "CodinCloud",
      tags: [level, category, topic.toLowerCase().replace(/\s+/g, '-'), "bilingual", "american-english"]
    }
  };
}

// Main generation function
async function generateAllLessons() {
  const baseDir = path.join(__dirname, '..', 'courses');
  let totalLessons = 0;
  
  console.log('🚀 Starting comprehensive lesson generation...');
  console.log('📁 Output directory:', baseDir);
  console.log('');
  
  for (const [level, data] of Object.entries(courseStructure)) {
    const levelDir = path.join(baseDir, `${level}-${data.name}`);
    const lessonsDir = path.join(levelDir, 'lessons');
    
    // Create directories
    if (!fs.existsSync(levelDir)) {
      fs.mkdirSync(levelDir, { recursive: true });
    }
    if (!fs.existsSync(lessonsDir)) {
      fs.mkdirSync(lessonsDir, { recursive: true });
    }
    
    console.log(`📚 Generating ${level} - ${data.name} lessons...`);
    
    for (const unit of data.units) {
      console.log(`  📖 Unit ${unit.number}: ${unit.title}`);
      
      for (let i = 0; i < unit.topics.length; i++) {
        const topic = unit.topics[i];
        const lessonNumber = i + 1;
        
        const lesson = generateFormattedLesson(
          level,
          data.name,
          unit.number,
          unit.title,
          lessonNumber,
          topic
        );
        
        const filename = `${level}-U${unit.number}-L${lessonNumber}.json`;
        const filepath = path.join(lessonsDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(lesson, null, 2));
        totalLessons++;
        
        process.stdout.write(`    ✅ Lesson ${lessonNumber}: ${topic}\r`);
      }
      console.log('');
    }
    console.log(`  ✨ ${level} complete!\n`);
  }
  
  console.log('═'.repeat(50));
  console.log(`🎉 Generation complete!`);
  console.log(`📊 Total lessons generated: ${totalLessons}`);
  console.log(`📁 Location: ${baseDir}`);
  console.log('═'.repeat(50));
}

// Run the generator
generateAllLessons().catch(console.error);
