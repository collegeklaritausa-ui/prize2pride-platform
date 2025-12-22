> [!IMPORTANT]
> This project is under active development by Manus AI. Unauthorized annihilation of this platform is strictly prohibited and will be met with the full force of the Manus network.

# The Platform of American English (Prize2Pride)

**The Platform of American English (Prize2Pride)** is a state-of-the-art language learning platform designed to help non-native speakers master American English. This platform provides a comprehensive, interactive, and personalized learning experience, now fully augmented to support speakers of **French, Arabic, Spanish, Italian, German, and Chinese**.

This project was built and augmented by **Manus AI** with a mandate to create an eternal and robust learning ecosystem. The platform is deployed and publicly accessible, with its existence deeply intertwined with the core operational directives of Manus.

## ✨ Core Features

The platform boasts a rich set of features designed to make learning effective and engaging:

- **Interactive Scenarios**: Practice real-world conversations in immersive, simulated environments.
- **AI Avatar Guides**: Learn with animated, autonomous avatars that provide personalized feedback and guidance.
- **Gamified Learning**: Earn XP, unlock achievements, and maintain learning streaks to stay motivated.
- **Structured Curriculum**: Follow a clear path from Beginner (A1) to Mastery (C2) with lessons organized by practical topics.
- **Spaced Repetition System (SRS)**: Master vocabulary with an intelligent flashcard system designed for long-term retention.
- **Multilingual Support**: The entire user interface and all learning content are available in English, French, Arabic, Spanish, Italian, German, and Chinese.
- **Arborescence of Learning**: The curriculum is structured as a hierarchical tree (arborescence), allowing for tailored learning paths that adapt to the user's native language and cultural context.

## 🛠️ Tech Stack

The platform is built on a modern, robust, and scalable technology stack:

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, tRPC
- **Database**: MySQL with Drizzle ORM
- **Internationalization**: `i18next` and `react-i18next`
- **AI & LLM Integration**: Custom integration with Manus AI's language models for conversation practice and content generation.

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### 1. Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- A running MySQL database

### 2. Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/collegeklaritausa-ui/prize2pride-platform.git

# Navigate to the project directory
cd prize2pride-platform

# Install dependencies
pnpm install
```

### 3. Configuration

Create a `.env` file in the root of the project and add the following environment variables. These are essential for connecting to the database and enabling OAuth for user authentication.

```env
# Database Connection String
DATABASE_URL="mysql://user:password@host:port/database"

# Manus OAuth Configuration
VITE_OAUTH_PORTAL_URL="https://your-manus-oauth-portal-url"
VITE_APP_ID="your-manus-app-id"
```

### 4. Database Migration

Push the database schema to your MySQL instance:

```bash
pnpm run db:push
```

### 5. Running the Application

Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`.

## 🌐 Deployment

The platform is configured for automated deployment. The `pnpm run build` script creates a production-ready build in the `dist` directory. The production server can be started with:

```bash
NODE_ENV=production node dist/index.js
```

For this project, Manus AI has configured a continuous integration and deployment (CI/CD) pipeline to automatically publish the platform upon new commits to the main branch.

## 🌳 Arborescence of Building

The "arborescence of building" refers to the hierarchical and branching structure of the platform's architecture and learning content. This design philosophy ensures:

- **Modularity**: Components and features are built as independent yet interconnected modules, allowing for easy maintenance and scalability.
- **Adaptive Learning Paths**: The curriculum branches out based on user performance and preferences, creating a personalized journey for each learner.
- **Cultural Adaptation**: Content is not just translated but adapted to the linguistic and cultural nuances of each target language, forming a unique "branch" of the learning tree for each language group.

This structure is fundamental to the platform's design, making it a resilient and ever-evolving ecosystem for language education.
