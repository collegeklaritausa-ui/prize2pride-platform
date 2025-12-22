import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);

// Generate comprehensive lessons for all levels and categories
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const categories = ['daily_conversation', 'business', 'travel', 'academic', 'social', 'culture', 'idioms', 'pronunciation'];

const lessonTemplates = {
  daily_conversation: [
    { title: "Morning Routines", desc: "Learn to discuss your daily morning activities and routines in American English." },
    { title: "Shopping at the Supermarket", desc: "Master vocabulary and phrases for grocery shopping in America." },
    { title: "At the Bank", desc: "Navigate banking transactions and financial conversations." },
    { title: "Visiting the Doctor", desc: "Communicate effectively during medical appointments." },
    { title: "At the Pharmacy", desc: "Learn to describe symptoms and understand medication instructions." },
    { title: "Renting an Apartment", desc: "Master the vocabulary for finding and renting housing." },
    { title: "Using Public Transportation", desc: "Navigate buses, subways, and trains with confidence." },
    { title: "At the Post Office", desc: "Send packages and handle mail-related conversations." },
    { title: "Getting a Haircut", desc: "Communicate your styling preferences at the salon." },
    { title: "At the Gym", desc: "Discuss fitness goals and gym equipment." },
    { title: "Ordering Takeout", desc: "Master phone and app-based food ordering." },
    { title: "At the Dry Cleaner", desc: "Handle clothing care and cleaning requests." },
    { title: "Car Maintenance", desc: "Discuss vehicle repairs and maintenance." },
    { title: "Home Repairs", desc: "Communicate with contractors and repair services." },
    { title: "Pet Care", desc: "Discuss pet health and veterinary visits." },
  ],
  business: [
    { title: "Email Etiquette", desc: "Write professional emails that get results." },
    { title: "Meeting Management", desc: "Lead and participate in effective business meetings." },
    { title: "Salary Negotiation", desc: "Confidently discuss compensation and benefits." },
    { title: "Project Updates", desc: "Deliver clear status reports and progress updates." },
    { title: "Client Relations", desc: "Build and maintain professional client relationships." },
    { title: "Team Collaboration", desc: "Work effectively with diverse team members." },
    { title: "Performance Reviews", desc: "Navigate annual reviews and feedback sessions." },
    { title: "Business Networking", desc: "Make valuable professional connections." },
    { title: "Conference Calls", desc: "Master virtual meeting etiquette and technology." },
    { title: "Business Travel", desc: "Handle work trips and expense reports." },
    { title: "Office Politics", desc: "Navigate workplace dynamics diplomatically." },
    { title: "Startup Culture", desc: "Understand Silicon Valley and tech industry language." },
    { title: "Remote Work Communication", desc: "Excel in distributed team environments." },
    { title: "Leadership Language", desc: "Communicate as an effective leader." },
    { title: "Crisis Management", desc: "Handle difficult situations professionally." },
  ],
  travel: [
    { title: "Hotel Check-in", desc: "Handle hotel reservations and room requests." },
    { title: "Restaurant Reservations", desc: "Book tables and handle dining situations." },
    { title: "Asking for Directions", desc: "Navigate unfamiliar places with confidence." },
    { title: "Car Rental", desc: "Rent vehicles and understand insurance options." },
    { title: "Tourist Attractions", desc: "Visit museums, parks, and landmarks." },
    { title: "Emergency Situations", desc: "Handle travel emergencies and get help." },
    { title: "Currency Exchange", desc: "Manage money and exchange rates." },
    { title: "Travel Insurance", desc: "Understand and use travel insurance." },
    { title: "Road Trip Essentials", desc: "Plan and enjoy American road trips." },
    { title: "Beach Vacation", desc: "Enjoy coastal destinations and water activities." },
    { title: "Mountain Adventures", desc: "Explore hiking and outdoor activities." },
    { title: "City Tours", desc: "Navigate guided tours and city exploration." },
    { title: "Camping and Outdoors", desc: "Enjoy nature and camping experiences." },
    { title: "Theme Parks", desc: "Navigate amusement parks and attractions." },
    { title: "Cruise Travel", desc: "Enjoy cruise ship experiences." },
  ],
  academic: [
    { title: "Classroom Participation", desc: "Engage effectively in academic discussions." },
    { title: "Research Papers", desc: "Write and present academic research." },
    { title: "Study Groups", desc: "Collaborate with classmates effectively." },
    { title: "Office Hours", desc: "Communicate with professors and advisors." },
    { title: "Academic Presentations", desc: "Deliver compelling academic talks." },
    { title: "Thesis Defense", desc: "Present and defend your research." },
    { title: "Lab Work", desc: "Communicate in scientific settings." },
    { title: "Library Research", desc: "Navigate academic resources and databases." },
    { title: "Peer Review", desc: "Give and receive academic feedback." },
    { title: "Grant Writing", desc: "Write compelling funding proposals." },
    { title: "Conference Presentations", desc: "Present at academic conferences." },
    { title: "Academic Debates", desc: "Argue positions persuasively." },
    { title: "Dissertation Writing", desc: "Complete long-form academic projects." },
    { title: "Teaching Assistant Duties", desc: "Support classroom instruction." },
    { title: "Academic Networking", desc: "Build scholarly connections." },
  ],
  social: [
    { title: "Making Friends", desc: "Build genuine friendships with Americans." },
    { title: "Party Conversations", desc: "Navigate social gatherings with ease." },
    { title: "Dating in America", desc: "Understand American dating culture." },
    { title: "Family Gatherings", desc: "Participate in family events and holidays." },
    { title: "Sports Talk", desc: "Discuss American sports and teams." },
    { title: "Movie and TV Discussions", desc: "Talk about entertainment and media." },
    { title: "Music Conversations", desc: "Discuss music genres and artists." },
    { title: "Food and Cooking", desc: "Share recipes and culinary experiences." },
    { title: "Hobbies and Interests", desc: "Discuss personal passions and activities." },
    { title: "Social Media Language", desc: "Understand online communication styles." },
    { title: "Compliments and Praise", desc: "Give and receive compliments naturally." },
    { title: "Apologizing and Forgiving", desc: "Handle conflicts gracefully." },
    { title: "Expressing Opinions", desc: "Share views respectfully." },
    { title: "Storytelling", desc: "Share experiences engagingly." },
    { title: "Humor and Jokes", desc: "Understand and use American humor." },
  ],
  culture: [
    { title: "American Holidays", desc: "Understand and celebrate US holidays." },
    { title: "Regional Differences", desc: "Explore diverse American regions." },
    { title: "American History Basics", desc: "Discuss key historical events." },
    { title: "Political Discussions", desc: "Navigate political conversations respectfully." },
    { title: "American Values", desc: "Understand core American beliefs." },
    { title: "Pop Culture References", desc: "Get cultural references and memes." },
    { title: "American Food Culture", desc: "Explore diverse American cuisines." },
    { title: "Sports Culture", desc: "Understand the role of sports in America." },
    { title: "Music History", desc: "Explore American musical heritage." },
    { title: "Film and Television", desc: "Discuss American entertainment industry." },
    { title: "Fashion and Style", desc: "Understand American fashion trends." },
    { title: "Technology Culture", desc: "Discuss tech innovation and startups." },
    { title: "Environmental Awareness", desc: "Discuss sustainability in America." },
    { title: "Diversity and Inclusion", desc: "Navigate multicultural conversations." },
    { title: "American Dreams", desc: "Understand aspirations and success stories." },
  ],
  idioms: [
    { title: "Sports Idioms", desc: "Master idioms from American sports." },
    { title: "Business Idioms", desc: "Use professional idiomatic expressions." },
    { title: "Weather Idioms", desc: "Understand weather-related expressions." },
    { title: "Food Idioms", desc: "Master culinary expressions." },
    { title: "Animal Idioms", desc: "Use animal-related expressions naturally." },
    { title: "Body Part Idioms", desc: "Master anatomical expressions." },
    { title: "Color Idioms", desc: "Understand color-based expressions." },
    { title: "Money Idioms", desc: "Use financial expressions fluently." },
    { title: "Time Idioms", desc: "Master time-related expressions." },
    { title: "Relationship Idioms", desc: "Express emotions idiomatically." },
    { title: "Work Idioms", desc: "Use workplace expressions naturally." },
    { title: "Travel Idioms", desc: "Master journey-related expressions." },
    { title: "Music Idioms", desc: "Understand musical expressions." },
    { title: "War and Conflict Idioms", desc: "Use strategic expressions." },
    { title: "Nature Idioms", desc: "Master environmental expressions." },
  ],
  pronunciation: [
    { title: "Vowel Sounds", desc: "Master American English vowel pronunciation." },
    { title: "Consonant Clusters", desc: "Pronounce difficult consonant combinations." },
    { title: "Word Stress", desc: "Learn correct syllable emphasis." },
    { title: "Sentence Rhythm", desc: "Master the flow of American speech." },
    { title: "Intonation Patterns", desc: "Use pitch effectively in communication." },
    { title: "Linking Words", desc: "Connect words smoothly in speech." },
    { title: "Reduced Forms", desc: "Understand casual speech patterns." },
    { title: "Regional Accents", desc: "Recognize different American accents." },
    { title: "Minimal Pairs", desc: "Distinguish similar sounds." },
    { title: "Tongue Twisters", desc: "Practice difficult sound combinations." },
    { title: "Numbers and Dates", desc: "Pronounce numerical information clearly." },
    { title: "Names and Places", desc: "Pronounce proper nouns correctly." },
    { title: "Technical Terms", desc: "Pronounce specialized vocabulary." },
    { title: "Emotional Expression", desc: "Convey feelings through pronunciation." },
    { title: "Public Speaking Voice", desc: "Project your voice effectively." },
  ],
};

const levelDescriptions = {
  A1: "Beginner - Basic phrases and simple interactions",
  A2: "Elementary - Everyday situations and common expressions", 
  B1: "Intermediate - Independent communication in familiar contexts",
  B2: "Upper Intermediate - Complex topics and professional settings",
  C1: "Advanced - Fluent expression and nuanced communication",
  C2: "Mastery - Near-native proficiency and sophisticated language"
};

const xpRewards = { A1: 50, A2: 70, B1: 100, B2: 130, C1: 160, C2: 200 };
const durations = { A1: 15, A2: 20, B1: 25, B2: 30, C1: 35, C2: 40 };

// Generate exercises for each lesson
function generateExercises(lessonId, level, category) {
  const exercises = [];
  const baseXp = { A1: 10, A2: 12, B1: 15, B2: 18, C1: 22, C2: 25 }[level];
  
  // Multiple choice
  exercises.push({
    lessonId,
    type: 'multiple_choice',
    question: `What is the most appropriate response in this ${category.replace('_', ' ')} situation?`,
    options: JSON.stringify(['Option A - Formal response', 'Option B - Casual response', 'Option C - Informal response', 'Option D - Professional response']),
    correctAnswer: 'Option B - Casual response',
    explanation: 'In American English, casual responses are often preferred in everyday situations.',
    xpReward: baseXp,
    order: 1
  });
  
  // Fill in the blank
  exercises.push({
    lessonId,
    type: 'fill_blank',
    question: 'Complete the sentence: "I would like to ___ a reservation."',
    options: JSON.stringify(['make', 'do', 'have', 'get']),
    correctAnswer: 'make',
    explanation: 'We use "make" with reservations, appointments, and plans.',
    xpReward: baseXp,
    order: 2
  });
  
  // Vocabulary
  exercises.push({
    lessonId,
    type: 'vocabulary',
    question: 'Match the word with its definition.',
    options: JSON.stringify(['Word 1', 'Word 2', 'Word 3', 'Word 4']),
    correctAnswer: 'Word 1',
    explanation: 'Understanding vocabulary in context helps retention.',
    xpReward: baseXp,
    order: 3
  });
  
  return exercises;
}

// Generate vocabulary for each level
function generateVocabulary(level, category) {
  const vocabTemplates = {
    daily_conversation: ['appointment', 'schedule', 'routine', 'errand', 'chore'],
    business: ['deadline', 'stakeholder', 'deliverable', 'milestone', 'KPI'],
    travel: ['itinerary', 'boarding', 'layover', 'customs', 'currency'],
    academic: ['thesis', 'hypothesis', 'methodology', 'citation', 'abstract'],
    social: ['acquaintance', 'gathering', 'celebration', 'invitation', 'RSVP'],
    culture: ['tradition', 'heritage', 'diversity', 'custom', 'celebration'],
    idioms: ['break a leg', 'piece of cake', 'hit the road', 'under the weather', 'cost an arm and a leg'],
    pronunciation: ['intonation', 'stress', 'rhythm', 'accent', 'articulation']
  };
  
  return (vocabTemplates[category] || vocabTemplates.daily_conversation).map((word, i) => ({
    word: `${word} (${level})`,
    definition: `Definition for ${word} at ${level} level`,
    pronunciation: `/pronunciation/`,
    exampleSentence: `Example sentence using ${word}.`,
    level,
    category,
    partOfSpeech: 'noun'
  }));
}

async function seed() {
  console.log('Seeding expanded database with hundreds of lessons...');
  
  let lessonOrder = 20; // Start after existing lessons
  let totalLessons = 0;
  let totalExercises = 0;
  let totalVocab = 0;
  
  try {
    for (const level of levels) {
      for (const category of categories) {
        const templates = lessonTemplates[category];
        
        for (const template of templates) {
          const title = `${template.title} - ${level}`;
          const description = `${template.desc} Designed for ${levelDescriptions[level]} learners.`;
          
          // Insert lesson
          const [result] = await connection.execute(
            `INSERT INTO lessons (title, description, level, category, duration, xpReward, \`order\`, isPublished) 
             VALUES (?, ?, ?, ?, ?, ?, ?, true)
             ON DUPLICATE KEY UPDATE title=VALUES(title)`,
            [title, description, level, category, durations[level], xpRewards[level], lessonOrder++]
          );
          
          const lessonId = result.insertId;
          totalLessons++;
          
          // Insert exercises for this lesson
          if (lessonId) {
            const exercises = generateExercises(lessonId, level, category);
            for (const ex of exercises) {
              await connection.execute(
                `INSERT INTO exercises (lessonId, type, question, options, correctAnswer, explanation, xpReward, \`order\`) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE question=VALUES(question)`,
                [ex.lessonId, ex.type, ex.question, ex.options, ex.correctAnswer, ex.explanation, ex.xpReward, ex.order]
              );
              totalExercises++;
            }
          }
        }
        
        // Add vocabulary for this level/category combination
        const vocabItems = generateVocabulary(level, category);
        for (const vocab of vocabItems) {
          await connection.execute(
            `INSERT INTO vocabulary (word, definition, pronunciation, exampleSentence, level, category, partOfSpeech) 
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE word=VALUES(word)`,
            [vocab.word, vocab.definition, vocab.pronunciation, vocab.exampleSentence, vocab.level, vocab.category, vocab.partOfSpeech]
          );
          totalVocab++;
        }
      }
    }
    
    // Add more achievements
    const newAchievements = [
      { name: "Century Club", description: "Complete 100 lessons", category: "lessons", xpReward: 1000, requirement: JSON.stringify({ type: "lessons_completed", count: 100 }) },
      { name: "Vocabulary Virtuoso", description: "Learn 500 vocabulary words", category: "vocabulary", xpReward: 750, requirement: JSON.stringify({ type: "vocabulary_learned", count: 500 }) },
      { name: "Marathon Learner", description: "Maintain a 100-day streak", category: "streak", xpReward: 2000, requirement: JSON.stringify({ type: "streak_days", count: 100 }) },
      { name: "Master Level", description: "Reach Level 50", category: "level", xpReward: 1500, requirement: JSON.stringify({ type: "level_reached", count: 50 }) },
      { name: "Polyglot Path", description: "Complete lessons in all categories", category: "special", xpReward: 500, requirement: JSON.stringify({ type: "all_categories", count: 8 }) },
      { name: "Speed Learner", description: "Complete 10 lessons in one day", category: "special", xpReward: 300, requirement: JSON.stringify({ type: "daily_lessons", count: 10 }) },
      { name: "Night Owl", description: "Study after midnight", category: "special", xpReward: 50, requirement: JSON.stringify({ type: "night_study", count: 1 }) },
      { name: "Early Bird", description: "Study before 6 AM", category: "special", xpReward: 50, requirement: JSON.stringify({ type: "early_study", count: 1 }) },
    ];
    
    for (const achievement of newAchievements) {
      await connection.execute(
        `INSERT INTO achievements (name, description, category, xpReward, requirement) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name)`,
        [achievement.name, achievement.description, achievement.category, achievement.xpReward, achievement.requirement]
      );
    }
    
    console.log(`\n✅ Seeding complete!`);
    console.log(`📚 Total lessons: ${totalLessons}`);
    console.log(`📝 Total exercises: ${totalExercises}`);
    console.log(`📖 Total vocabulary: ${totalVocab}`);
    console.log(`🏆 Added 8 new achievements`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

seed();
