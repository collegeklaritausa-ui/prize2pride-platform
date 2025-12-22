# Multilingual Arborescence Structure Design

This document outlines the design for augmenting the Prize2Pride platform with a multilingual learning experience, supporting French, Arabic, Spanish, Italian, German, and Chinese speakers.

## 1. Database Schema Augmentation

To support multilingual content, we will introduce a `language` field to the following tables in `drizzle/schema.ts`:

- **`lessons`**: To store lesson titles and descriptions in multiple languages.
- **`lesson_content`**: To store scenario and dialogue content in multiple languages.
- **`exercises`**: To store questions, options, and explanations in multiple languages.
- **`vocabulary`**: To store word definitions, example sentences, and pronunciations in multiple languages.

A `language` enum will be defined to ensure data consistency:

```typescript
export const supportedLanguages = ["en", "fr", "ar", "es", "it", "de", "zh"] as const;
export type SupportedLanguage = typeof supportedLanguages[number];
```

## 2. UI Internationalization (i18n)

We will implement a robust internationalization (i18n) solution for the React frontend to translate all user interface elements.

- **Library**: We will use the `i18next` library with `react-i18next` for seamless integration with React components.
- **Translation Files**: JSON files will be created for each supported language in the `client/src/locales` directory (e.g., `en.json`, `fr.json`, `ar.json`, etc.). These files will store key-value pairs for all UI strings.
- **Language Selector**: A language switcher component will be added to the user interface, allowing users to select their preferred language. The selected language will be stored in the user's profile and local storage.

## 3. Content Translation Workflow

All existing and new learning content will be translated into the six target languages. This will be achieved through a combination of automated and manual processes:

- **Automated Translation**: We will leverage a Large Language Model (LLM) to perform the initial translation of all lesson content, exercises, and vocabulary. This will be done programmatically to ensure scalability.
- **Manual Review and Refinement**: While automated translation provides a solid baseline, a manual review process by native speakers will be crucial to ensure accuracy, cultural relevance, and pedagogical effectiveness. The platform will include an admin interface for content managers to review and edit translations.

## 4. Arborescence of Learning Paths

The "arborescence" or hierarchical structure of the learning paths will be adapted for each language. This means that while the core curriculum and proficiency levels (A1-C2) will remain consistent, the content within each lesson will be tailored to the specific linguistic and cultural context of the target audience.

- **Language-Specific Content**: For example, a lesson on "Business Etiquette" might have different scenarios and vocabulary for a user learning American English from a German background compared to a user from a Chinese background.
- **Personalized Recommendations**: The recommendation engine will be enhanced to consider the user's native language and learning goals, suggesting the most relevant lessons and exercises.

By implementing this multilingual arborescence structure, we will transform the Prize2Pride platform into a truly global and personalized learning experience.
