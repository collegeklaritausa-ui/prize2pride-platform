CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`iconUrl` text,
	`xpReward` int NOT NULL DEFAULT 100,
	`requirement` text NOT NULL,
	`category` enum('lessons','vocabulary','streak','level','special') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `avatars` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`personality` text NOT NULL,
	`avatarUrl` text,
	`voiceId` varchar(64),
	`specialty` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `avatars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversation_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scenarioId` varchar(64) NOT NULL,
	`avatarId` varchar(64) NOT NULL,
	`messages` json,
	`feedback` text,
	`score` int,
	`xpEarned` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	CONSTRAINT `conversation_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`type` enum('listening','speaking','vocabulary','grammar','fill_blank','multiple_choice') NOT NULL,
	`question` text NOT NULL,
	`options` json,
	`correctAnswer` text NOT NULL,
	`explanation` text,
	`audioUrl` text,
	`xpReward` int NOT NULL DEFAULT 10,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`type` enum('scenario','dialogue','explanation','tip') NOT NULL,
	`title` varchar(255),
	`content` text NOT NULL,
	`avatarId` varchar(64),
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lesson_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
	`category` enum('daily_conversation','business','travel','academic','social','culture','idioms','pronunciation') NOT NULL,
	`thumbnailUrl` text,
	`duration` int DEFAULT 15,
	`xpReward` int NOT NULL DEFAULT 50,
	`order` int NOT NULL DEFAULT 0,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_exercise_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exerciseId` int NOT NULL,
	`userAnswer` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`xpEarned` int NOT NULL DEFAULT 0,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_exercise_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_lesson_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`progress` int NOT NULL DEFAULT 0,
	`score` int DEFAULT 0,
	`xpEarned` int NOT NULL DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`lastAccessedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_lesson_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_vocabulary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`vocabularyId` int NOT NULL,
	`easeFactor` int NOT NULL DEFAULT 250,
	`interval` int NOT NULL DEFAULT 1,
	`repetitions` int NOT NULL DEFAULT 0,
	`nextReviewDate` timestamp NOT NULL DEFAULT (now()),
	`lastReviewedAt` timestamp,
	`status` enum('new','learning','review','mastered') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_vocabulary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`word` varchar(255) NOT NULL,
	`definition` text NOT NULL,
	`pronunciation` varchar(255),
	`partOfSpeech` varchar(64),
	`exampleSentence` text,
	`audioUrl` text,
	`level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
	`category` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vocabulary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `xp` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `level` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `streak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastActivityDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLevel` enum('A1','A2','B1','B2','C1','C2') DEFAULT 'A1';