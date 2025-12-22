import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);

// Sample Lessons (using correct column names: order instead of orderIndex)
const lessons = [
  // A1 Level
  { title: "Greetings and Introductions", description: "Learn how to introduce yourself and greet others in everyday American English situations.", level: "A1", category: "daily_conversation", duration: 15, xpReward: 50, order: 1 },
  { title: "At the Coffee Shop", description: "Master ordering drinks and snacks at an American coffee shop with confidence.", level: "A1", category: "daily_conversation", duration: 20, xpReward: 60, order: 2 },
  { title: "Numbers and Prices", description: "Learn to understand and use numbers, prices, and basic math in everyday situations.", level: "A1", category: "daily_conversation", duration: 15, xpReward: 50, order: 3 },
  // A2 Level
  { title: "Making Small Talk", description: "Learn the art of casual conversation with Americans about weather, sports, and daily life.", level: "A2", category: "social", duration: 20, xpReward: 70, order: 4 },
  { title: "At the Restaurant", description: "Navigate American restaurants from making reservations to paying the bill.", level: "A2", category: "daily_conversation", duration: 25, xpReward: 80, order: 5 },
  { title: "Airport Navigation", description: "Learn essential English for navigating American airports from check-in to boarding.", level: "A2", category: "travel", duration: 25, xpReward: 80, order: 6 },
  // B1 Level
  { title: "Job Interview Basics", description: "Prepare for American job interviews with common questions and professional responses.", level: "B1", category: "business", duration: 30, xpReward: 100, order: 7 },
  { title: "Phone Conversations", description: "Master phone etiquette and common expressions for business and personal calls.", level: "B1", category: "business", duration: 25, xpReward: 90, order: 8 },
  { title: "American Idioms Part 1", description: "Learn common American idioms and expressions used in everyday conversation.", level: "B1", category: "idioms", duration: 20, xpReward: 85, order: 9 },
  // B2 Level
  { title: "Presentations and Public Speaking", description: "Develop skills for giving effective presentations in American professional settings.", level: "B2", category: "business", duration: 35, xpReward: 120, order: 10 },
  { title: "Negotiation Skills", description: "Learn to negotiate effectively in American business contexts.", level: "B2", category: "business", duration: 30, xpReward: 110, order: 11 },
  { title: "Academic Writing", description: "Master the conventions of American academic writing for essays and papers.", level: "B2", category: "academic", duration: 40, xpReward: 130, order: 12 },
  // C1 Level
  { title: "Advanced Business Communication", description: "Master sophisticated business English for executive-level communication.", level: "C1", category: "business", duration: 45, xpReward: 150, order: 13 },
  { title: "American Culture Deep Dive", description: "Explore nuanced aspects of American culture, humor, and social norms.", level: "C1", category: "culture", duration: 35, xpReward: 140, order: 14 },
  // C2 Level
  { title: "Mastering American Humor", description: "Understand and use American humor, wit, and comedic timing effectively.", level: "C2", category: "culture", duration: 40, xpReward: 160, order: 15 }
];

// Sample Exercises (using correct column names: order instead of orderIndex)
const exercises = [
  // Lesson 1 exercises
  { lessonId: 1, type: "multiple_choice", question: "How do you greet someone in the morning?", options: JSON.stringify(["Good morning!", "Good night!", "Goodbye!", "See you later!"]), correctAnswer: "Good morning!", explanation: "'Good morning' is used to greet people from sunrise until noon.", xpReward: 10, order: 1 },
  { lessonId: 1, type: "fill_blank", question: "Nice to ___ you!", options: JSON.stringify(["meet", "see", "know", "have"]), correctAnswer: "meet", explanation: "'Nice to meet you' is the standard phrase when meeting someone for the first time.", xpReward: 10, order: 2 },
  { lessonId: 1, type: "multiple_choice", question: "What's a casual way to say 'How are you?'", options: JSON.stringify(["How's it going?", "How do you do?", "Pleased to meet you", "Good evening"]), correctAnswer: "How's it going?", explanation: "'How's it going?' is a casual, friendly way to ask how someone is doing.", xpReward: 10, order: 3 },
  
  // Lesson 2 exercises
  { lessonId: 2, type: "multiple_choice", question: "What does 'for here or to-go?' mean?", options: JSON.stringify(["Eat in the shop or take away", "Hot or cold drink", "Large or small size", "With or without sugar"]), correctAnswer: "Eat in the shop or take away", explanation: "Staff ask this to know if you'll eat there or take your order with you.", xpReward: 10, order: 1 },
  { lessonId: 2, type: "fill_blank", question: "Can I get a ___ latte, please?", options: JSON.stringify(["grande", "big", "huge", "massive"]), correctAnswer: "grande", explanation: "Coffee shops often use Italian sizes: tall, grande, venti.", xpReward: 10, order: 2 },
  
  // Lesson 4 exercises
  { lessonId: 4, type: "multiple_choice", question: "What's a good response to 'What's up?'", options: JSON.stringify(["Not much, you?", "The sky", "I'm fine, thank you", "Hello"]), correctAnswer: "Not much, you?", explanation: "'Not much' is the casual, expected response to 'What's up?'", xpReward: 15, order: 1 },
  { lessonId: 4, type: "fill_blank", question: "How's your weekend ___?", options: JSON.stringify(["going", "doing", "being", "having"]), correctAnswer: "going", explanation: "'How's your weekend going?' is a natural way to ask about someone's weekend.", xpReward: 15, order: 2 },
  
  // Lesson 7 exercises
  { lessonId: 7, type: "multiple_choice", question: "What's the best way to start answering 'Tell me about yourself'?", options: JSON.stringify(["With your professional background", "With your childhood story", "With your hobbies", "With your salary expectations"]), correctAnswer: "With your professional background", explanation: "In interviews, focus on your professional experience and relevant skills.", xpReward: 20, order: 1 },
  { lessonId: 7, type: "fill_blank", question: "I'm a ___ player who enjoys collaborating with others.", options: JSON.stringify(["team", "game", "sport", "group"]), correctAnswer: "team", explanation: "'Team player' is a common phrase meaning someone who works well with others.", xpReward: 20, order: 2 }
];

// Sample Vocabulary
const vocabulary = [
  // A1 Level
  { word: "Hello", definition: "A greeting used when meeting someone", pronunciation: "/həˈloʊ/", exampleSentence: "Hello! How are you today?", level: "A1", category: "greetings", partOfSpeech: "interjection" },
  { word: "Goodbye", definition: "A farewell expression when leaving", pronunciation: "/ɡʊdˈbaɪ/", exampleSentence: "Goodbye! See you tomorrow!", level: "A1", category: "greetings", partOfSpeech: "interjection" },
  { word: "Please", definition: "A polite word used when asking for something", pronunciation: "/pliːz/", exampleSentence: "Can I have a coffee, please?", level: "A1", category: "polite_expressions", partOfSpeech: "adverb" },
  { word: "Thank you", definition: "An expression of gratitude", pronunciation: "/θæŋk juː/", exampleSentence: "Thank you for your help!", level: "A1", category: "polite_expressions", partOfSpeech: "interjection" },
  { word: "Sorry", definition: "An expression of apology or regret", pronunciation: "/ˈsɑːri/", exampleSentence: "Sorry, I didn't understand that.", level: "A1", category: "polite_expressions", partOfSpeech: "interjection" },
  
  // A2 Level
  { word: "Awesome", definition: "Extremely good; excellent (informal)", pronunciation: "/ˈɔːsəm/", exampleSentence: "That movie was awesome!", level: "A2", category: "adjectives", partOfSpeech: "adjective" },
  { word: "Cool", definition: "Fashionable, impressive, or calm (informal)", pronunciation: "/kuːl/", exampleSentence: "That's a cool jacket you're wearing.", level: "A2", category: "adjectives", partOfSpeech: "adjective" },
  { word: "Hang out", definition: "To spend time relaxing or socializing", pronunciation: "/hæŋ aʊt/", exampleSentence: "Want to hang out this weekend?", level: "A2", category: "phrasal_verbs", partOfSpeech: "phrasal verb" },
  { word: "Check out", definition: "To look at or examine something", pronunciation: "/tʃek aʊt/", exampleSentence: "Check out this new restaurant!", level: "A2", category: "phrasal_verbs", partOfSpeech: "phrasal verb" },
  
  // B1 Level
  { word: "Piece of cake", definition: "Something very easy to do", pronunciation: "/piːs əv keɪk/", exampleSentence: "The test was a piece of cake.", level: "B1", category: "idioms", partOfSpeech: "idiom" },
  { word: "Break a leg", definition: "Good luck (especially before a performance)", pronunciation: "/breɪk ə leɡ/", exampleSentence: "Break a leg at your interview tomorrow!", level: "B1", category: "idioms", partOfSpeech: "idiom" },
  { word: "Hit the road", definition: "To leave or start a journey", pronunciation: "/hɪt ðə roʊd/", exampleSentence: "It's getting late, I should hit the road.", level: "B1", category: "idioms", partOfSpeech: "idiom" },
  { word: "Under the weather", definition: "Feeling slightly ill", pronunciation: "/ˈʌndər ðə ˈweðər/", exampleSentence: "I'm feeling a bit under the weather today.", level: "B1", category: "idioms", partOfSpeech: "idiom" },
  { word: "Networking", definition: "Building professional relationships", pronunciation: "/ˈnetwɜːrkɪŋ/", exampleSentence: "Networking is important for career growth.", level: "B1", category: "business", partOfSpeech: "noun" },
  
  // B2 Level
  { word: "Bottom line", definition: "The final result or most important point", pronunciation: "/ˈbɑːtəm laɪn/", exampleSentence: "The bottom line is we need to increase sales.", level: "B2", category: "business", partOfSpeech: "noun" },
  { word: "Win-win", definition: "A situation beneficial to all parties", pronunciation: "/wɪn wɪn/", exampleSentence: "Let's find a win-win solution.", level: "B2", category: "business", partOfSpeech: "adjective" },
  { word: "Think outside the box", definition: "To think creatively or unconventionally", pronunciation: "/θɪŋk aʊtˈsaɪd ðə bɑːks/", exampleSentence: "We need to think outside the box to solve this.", level: "B2", category: "idioms", partOfSpeech: "idiom" },
  { word: "On the same page", definition: "In agreement or having the same understanding", pronunciation: "/ɑːn ðə seɪm peɪdʒ/", exampleSentence: "Let's make sure we're on the same page.", level: "B2", category: "idioms", partOfSpeech: "idiom" },
  
  // C1 Level
  { word: "Leverage", definition: "To use something to maximum advantage", pronunciation: "/ˈlevərɪdʒ/", exampleSentence: "We can leverage our expertise in this market.", level: "C1", category: "business", partOfSpeech: "verb" },
  { word: "Synergy", definition: "Combined effect greater than separate effects", pronunciation: "/ˈsɪnərdʒi/", exampleSentence: "The merger created great synergy between teams.", level: "C1", category: "business", partOfSpeech: "noun" },
  { word: "Nuance", definition: "A subtle difference in meaning or expression", pronunciation: "/ˈnuːɑːns/", exampleSentence: "Understanding cultural nuances is important.", level: "C1", category: "academic", partOfSpeech: "noun" },
  
  // C2 Level
  { word: "Tongue-in-cheek", definition: "Said or done in a humorous, ironic way", pronunciation: "/tʌŋ ɪn tʃiːk/", exampleSentence: "His comment was tongue-in-cheek.", level: "C2", category: "idioms", partOfSpeech: "adjective" },
  { word: "Deadpan", definition: "Deliberately impassive or expressionless", pronunciation: "/ˈdedpæn/", exampleSentence: "She delivered the joke with a deadpan expression.", level: "C2", category: "humor", partOfSpeech: "adjective" }
];

// Sample Achievements (using iconUrl instead of iconName)
const achievements = [
  // Lesson achievements
  { name: "First Steps", description: "Complete your first lesson", category: "lessons", xpReward: 50, requirement: JSON.stringify({ type: "lessons_completed", count: 1 }) },
  { name: "Dedicated Learner", description: "Complete 5 lessons", category: "lessons", xpReward: 100, requirement: JSON.stringify({ type: "lessons_completed", count: 5 }) },
  { name: "Knowledge Seeker", description: "Complete 10 lessons", category: "lessons", xpReward: 200, requirement: JSON.stringify({ type: "lessons_completed", count: 10 }) },
  { name: "Scholar", description: "Complete 25 lessons", category: "lessons", xpReward: 500, requirement: JSON.stringify({ type: "lessons_completed", count: 25 }) },
  
  // Vocabulary achievements
  { name: "Word Collector", description: "Learn 10 vocabulary words", category: "vocabulary", xpReward: 50, requirement: JSON.stringify({ type: "vocabulary_learned", count: 10 }) },
  { name: "Vocabulary Builder", description: "Learn 50 vocabulary words", category: "vocabulary", xpReward: 150, requirement: JSON.stringify({ type: "vocabulary_learned", count: 50 }) },
  { name: "Word Master", description: "Learn 100 vocabulary words", category: "vocabulary", xpReward: 300, requirement: JSON.stringify({ type: "vocabulary_learned", count: 100 }) },
  
  // Streak achievements
  { name: "Getting Started", description: "Maintain a 3-day learning streak", category: "streak", xpReward: 30, requirement: JSON.stringify({ type: "streak_days", count: 3 }) },
  { name: "Consistent Learner", description: "Maintain a 7-day learning streak", category: "streak", xpReward: 100, requirement: JSON.stringify({ type: "streak_days", count: 7 }) },
  { name: "Dedicated Student", description: "Maintain a 30-day learning streak", category: "streak", xpReward: 500, requirement: JSON.stringify({ type: "streak_days", count: 30 }) },
  
  // Level achievements
  { name: "Rising Star", description: "Reach Level 5", category: "level", xpReward: 100, requirement: JSON.stringify({ type: "level_reached", count: 5 }) },
  { name: "Intermediate", description: "Reach Level 10", category: "level", xpReward: 250, requirement: JSON.stringify({ type: "level_reached", count: 10 }) },
  { name: "Advanced", description: "Reach Level 20", category: "level", xpReward: 500, requirement: JSON.stringify({ type: "level_reached", count: 20 }) },
  
  // Special achievements
  { name: "Conversation Starter", description: "Complete your first AI conversation", category: "special", xpReward: 75, requirement: JSON.stringify({ type: "conversations_completed", count: 1 }) },
  { name: "Social Butterfly", description: "Complete 10 AI conversations", category: "special", xpReward: 200, requirement: JSON.stringify({ type: "conversations_completed", count: 10 }) },
  { name: "Perfect Score", description: "Get 100% on any lesson", category: "special", xpReward: 100, requirement: JSON.stringify({ type: "perfect_score", count: 1 }) }
];

// Sample Avatars
const avatars = [
  { id: "emma", name: "Emma", personality: "Friendly and patient American English teacher from California. Warm, encouraging, and great at explaining things simply.", specialty: "Daily Conversation" },
  { id: "james", name: "James", personality: "Professional business consultant from New York City. Direct, knowledgeable about corporate culture, and skilled at business communication.", specialty: "Business English" },
  { id: "sophia", name: "Sophia", personality: "Enthusiastic travel blogger who loves sharing stories about adventures across America. Casual, fun, and full of travel tips.", specialty: "Travel English" },
  { id: "michael", name: "Michael", personality: "Patient professor with expertise in clear explanations. Academic but approachable, great at breaking down complex topics.", specialty: "Academic English" }
];

async function seed() {
  console.log('Seeding database...');
  
  try {
    // Insert lessons
    console.log('Inserting lessons...');
    for (const lesson of lessons) {
      await connection.execute(
        `INSERT INTO lessons (title, description, level, category, duration, xpReward, \`order\`) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [lesson.title, lesson.description, lesson.level, lesson.category, lesson.duration, lesson.xpReward, lesson.order]
      );
    }
    console.log(`Inserted ${lessons.length} lessons`);

    // Insert exercises
    console.log('Inserting exercises...');
    for (const exercise of exercises) {
      await connection.execute(
        `INSERT INTO exercises (lessonId, type, question, options, correctAnswer, explanation, xpReward, \`order\`) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE question=VALUES(question)`,
        [exercise.lessonId, exercise.type, exercise.question, exercise.options, exercise.correctAnswer, exercise.explanation, exercise.xpReward, exercise.order]
      );
    }
    console.log(`Inserted ${exercises.length} exercises`);

    // Insert vocabulary
    console.log('Inserting vocabulary...');
    for (const vocab of vocabulary) {
      await connection.execute(
        `INSERT INTO vocabulary (word, definition, pronunciation, exampleSentence, level, category, partOfSpeech) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE word=VALUES(word)`,
        [vocab.word, vocab.definition, vocab.pronunciation, vocab.exampleSentence, vocab.level, vocab.category, vocab.partOfSpeech]
      );
    }
    console.log(`Inserted ${vocabulary.length} vocabulary words`);

    // Insert achievements
    console.log('Inserting achievements...');
    for (const achievement of achievements) {
      await connection.execute(
        `INSERT INTO achievements (name, description, category, xpReward, requirement) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name)`,
        [achievement.name, achievement.description, achievement.category, achievement.xpReward, achievement.requirement]
      );
    }
    console.log(`Inserted ${achievements.length} achievements`);

    // Insert avatars
    console.log('Inserting avatars...');
    for (const avatar of avatars) {
      await connection.execute(
        `INSERT INTO avatars (id, name, personality, specialty) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name)`,
        [avatar.id, avatar.name, avatar.personality, avatar.specialty]
      );
    }
    console.log(`Inserted ${avatars.length} avatars`);

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

seed();
