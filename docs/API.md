# Prize2Pride Platform API Documentation

## OMEGA777 2.5 - Eternal API Reference

### Overview

The Prize2Pride API provides comprehensive endpoints for language learning, AI-powered content generation, and user progress tracking. Built with tRPC for type-safe API calls.

---

## Authentication

All protected endpoints require authentication via OAuth. Include the session cookie in requests.

```typescript
// Client-side usage with tRPC
import { trpc } from '@/lib/trpc';

const user = await trpc.system.getUser.query();
```

---

## Core Endpoints

### System

| Endpoint | Type | Description |
|----------|------|-------------|
| `system.health` | Query | Get system health status |
| `system.getUser` | Query | Get current authenticated user |
| `system.logout` | Mutation | Log out current user |

### Lessons

| Endpoint | Type | Description |
|----------|------|-------------|
| `lessons.getAll` | Query | Get all available lessons |
| `lessons.getById` | Query | Get lesson by ID |
| `lessons.getByLevel` | Query | Get lessons filtered by level |
| `lessons.complete` | Mutation | Mark lesson as completed |
| `lessons.getProgress` | Query | Get user's lesson progress |

### Vocabulary

| Endpoint | Type | Description |
|----------|------|-------------|
| `vocabulary.getAll` | Query | Get all vocabulary items |
| `vocabulary.getByLevel` | Query | Get vocabulary by proficiency level |
| `vocabulary.addToFlashcards` | Mutation | Add word to user's flashcards |
| `vocabulary.getFlashcards` | Query | Get user's flashcard collection |
| `vocabulary.updateMastery` | Mutation | Update word mastery level |

### Achievements

| Endpoint | Type | Description |
|----------|------|-------------|
| `achievements.getAll` | Query | Get all achievements |
| `achievements.getUserAchievements` | Query | Get user's unlocked achievements |
| `achievements.checkAndUnlock` | Mutation | Check and unlock new achievements |

---

## AI-Powered Endpoints

### Text-to-Speech

```typescript
// Generate speech from text
const audio = await trpc.tts.generateSpeech.mutate({
  text: "Hello, how are you?",
  voice: "nova", // alloy, echo, fable, onyx, nova, shimmer
  speed: 1.0
});

// Generate pronunciation for vocabulary
const pronunciation = await trpc.tts.generatePronunciation.mutate({
  word: "entrepreneur"
});

// Generate avatar speech
const avatarAudio = await trpc.tts.generateAvatarSpeech.mutate({
  text: "Welcome to your lesson!",
  avatarId: "professor-emma"
});
```

### AI Image Generation

```typescript
// Generate avatar image
const avatar = await trpc.aiImages.generateAvatar.mutate({
  avatarId: "professor-emma",
  pose: "teaching", // portrait, teaching, presenting, thinking, celebrating
  emotion: "encouraging" // neutral, happy, encouraging, thoughtful, excited
});

// Generate educational image
const eduImage = await trpc.aiImages.generateEducational.mutate({
  topic: "American Coffee Culture",
  level: "B1",
  category: "culture",
  style: "realistic" // realistic, illustrated, infographic, diagram
});

// Generate vocabulary illustration
const vocabImage = await trpc.aiImages.generateVocabulary.mutate({
  word: "serendipity",
  definition: "The occurrence of events by chance in a happy way",
  exampleSentence: "Finding that book was pure serendipity.",
  level: "C1"
});

// Generate scenario image
const scenario = await trpc.aiImages.generateScenario.mutate({
  scenario: "Job interview at a tech company",
  setting: "Modern office with glass walls",
  mood: "professional"
});

// Get available avatar templates
const templates = await trpc.aiImages.getAvatarTemplates.query();
```

### Conversation AI

```typescript
// Start conversation practice
const response = await trpc.conversation.chat.mutate({
  sessionId: "session-123",
  message: "Hi, I'd like to practice ordering at a restaurant.",
  scenario: "Restaurant ordering",
  avatarId: "coach-sophia"
});

// Get AI feedback on response
const feedback = await trpc.conversation.getFeedback.mutate({
  question: "What would you like to order?",
  userAnswer: "I would like the chicken salad, please.",
  correctAnswer: null // For open-ended questions
});

// End conversation and get summary
const summary = await trpc.conversation.endSession.mutate({
  sessionId: "session-123"
});
```

---

## Progress & Goals

### Daily Goals

```typescript
// Get daily goals
const goals = await trpc.goals.getDaily.query();

// Update progress
const updated = await trpc.goals.updateProgress.mutate({
  earnedXp: 50,
  completedLessons: 1,
  reviewedVocabulary: 10,
  practiceMinutes: 15
});
```

### Certificates

```typescript
// Generate completion certificate
const cert = await trpc.certificates.generate.mutate({
  lessonTitle: "Business Email Writing",
  level: "B2",
  score: 95,
  xpEarned: 120
});
```

### Social Sharing

```typescript
// Get share links for achievement
const shareLinks = await trpc.sharing.getAchievementShareLinks.query({
  achievementName: "Week Warrior",
  achievementDescription: "Maintained a 7-day learning streak"
});

// Get share links for streak
const streakShare = await trpc.sharing.getStreakShareLinks.query({
  streakDays: 30
});
```

---

## Avatar Templates

| ID | Name | Specialty | Personality |
|----|------|-----------|-------------|
| `professor-emma` | Professor Emma | Grammar & Academic English | Warm, patient, knowledgeable |
| `coach-sophia` | Coach Sophia | Conversation & Speaking | Energetic, motivating, fun |
| `mentor-olivia` | Mentor Olivia | Business English | Calm, supportive, insightful |
| `guide-maya` | Guide Maya | Cultural Learning & Idioms | Curious, adventurous |
| `tutor-lily` | Tutor Lily | Beginner English | Gentle, encouraging |
| `instructor-isabella` | Instructor Isabella | Pronunciation & Listening | Passionate, expressive |

---

## Proficiency Levels

| Level | Description | Target Skills |
|-------|-------------|---------------|
| A1 | Beginner | Basic phrases, simple vocabulary |
| A2 | Elementary | Everyday expressions, simple sentences |
| B1 | Intermediate | Main points, standard speech |
| B2 | Upper Intermediate | Complex texts, fluent interaction |
| C1 | Advanced | Implicit meaning, flexible language |
| C2 | Mastery | Near-native proficiency |

---

## Error Handling

All endpoints return standardized error responses:

```typescript
interface TRPCError {
  code: string;
  message: string;
  data?: {
    code: string;
    httpStatus: number;
    path: string;
  };
}
```

Common error codes:
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `INTERNAL_SERVER_ERROR` - Server error

---

## Rate Limiting

- **Default**: 1000 requests per minute per user
- **AI Generation**: 100 requests per minute per user
- **Image Generation**: 20 requests per minute per user

---

## Webhooks (Coming Soon)

Subscribe to events:
- `lesson.completed`
- `achievement.unlocked`
- `level.advanced`
- `streak.milestone`

---

## SDK Usage

```typescript
import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from 'prize2pride/server';

const client = createTRPCClient<AppRouter>({
  url: 'https://api.prize2pride.com/trpc',
});

// Type-safe API calls
const lessons = await client.lessons.getAll.query();
const user = await client.system.getUser.query();
```

---

**Version**: OMEGA777 2.5  
**Last Updated**: December 2024  
**Support**: https://prize2pride.com/support
