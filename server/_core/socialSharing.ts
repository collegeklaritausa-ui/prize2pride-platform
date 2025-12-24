/**
 * Social Sharing Service for Prize2Pride Platform
 * Enables sharing achievements and progress on social media
 */

interface ShareableContent {
  type: 'achievement' | 'milestone' | 'streak' | 'certificate' | 'level_up';
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
}

interface SocialShareLinks {
  twitter: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  telegram: string;
  copyLink: string;
}

const PLATFORM_URL = 'https://prize2pride.com';
const PLATFORM_HASHTAGS = ['Prize2Pride', 'LearnEnglish', 'AmericanEnglish', 'LanguageLearning'];

/**
 * Generate shareable content for an achievement
 */
export function createAchievementShare(
  achievementName: string,
  achievementDescription: string,
  userName: string
): ShareableContent {
  return {
    type: 'achievement',
    title: `🏆 ${userName} unlocked "${achievementName}" on Prize2Pride!`,
    description: achievementDescription,
    url: `${PLATFORM_URL}/achievements`
  };
}

/**
 * Generate shareable content for a learning milestone
 */
export function createMilestoneShare(
  milestoneType: 'lessons' | 'vocabulary' | 'xp',
  count: number,
  userName: string
): ShareableContent {
  const milestoneMessages = {
    lessons: {
      title: `📚 ${userName} completed ${count} lessons on Prize2Pride!`,
      description: `I've completed ${count} English lessons and I'm making great progress! Join me on Prize2Pride.`
    },
    vocabulary: {
      title: `📖 ${userName} mastered ${count} vocabulary words!`,
      description: `I've learned ${count} new English words on Prize2Pride. My vocabulary is growing every day!`
    },
    xp: {
      title: `⚡ ${userName} earned ${count} XP on Prize2Pride!`,
      description: `I've earned ${count} experience points learning American English. The journey continues!`
    }
  };

  const message = milestoneMessages[milestoneType];
  
  return {
    type: 'milestone',
    title: message.title,
    description: message.description,
    url: `${PLATFORM_URL}/dashboard`
  };
}

/**
 * Generate shareable content for a learning streak
 */
export function createStreakShare(streakDays: number, userName: string): ShareableContent {
  const streakEmojis = streakDays >= 30 ? '🔥🔥🔥' : streakDays >= 7 ? '🔥🔥' : '🔥';
  
  return {
    type: 'streak',
    title: `${streakEmojis} ${userName} is on a ${streakDays}-day learning streak!`,
    description: `I've been learning English for ${streakDays} days straight on Prize2Pride! Consistency is key to mastery.`,
    url: `${PLATFORM_URL}/dashboard`
  };
}

/**
 * Generate shareable content for a certificate
 */
export function createCertificateShare(
  lessonTitle: string,
  level: string,
  score: number,
  userName: string
): ShareableContent {
  return {
    type: 'certificate',
    title: `🎓 ${userName} earned a certificate in "${lessonTitle}"!`,
    description: `I completed the ${level} level course "${lessonTitle}" with a score of ${score}% on Prize2Pride!`,
    url: `${PLATFORM_URL}/certificates`
  };
}

/**
 * Generate shareable content for leveling up
 */
export function createLevelUpShare(
  newLevel: string,
  userName: string
): ShareableContent {
  const levelDescriptions: Record<string, string> = {
    'A1': 'Beginner',
    'A2': 'Elementary',
    'B1': 'Intermediate',
    'B2': 'Upper Intermediate',
    'C1': 'Advanced',
    'C2': 'Mastery'
  };

  return {
    type: 'level_up',
    title: `🚀 ${userName} reached ${newLevel} (${levelDescriptions[newLevel]}) level!`,
    description: `I've leveled up to ${newLevel} - ${levelDescriptions[newLevel]} on Prize2Pride! My English skills are improving every day.`,
    url: `${PLATFORM_URL}/dashboard`
  };
}

/**
 * Generate social media share links
 */
export function generateShareLinks(content: ShareableContent): SocialShareLinks {
  const encodedTitle = encodeURIComponent(content.title);
  const encodedDescription = encodeURIComponent(content.description);
  const encodedUrl = encodeURIComponent(content.url);
  const hashtags = PLATFORM_HASHTAGS.join(',');
  const hashtagsEncoded = encodeURIComponent(PLATFORM_HASHTAGS.map(h => `#${h}`).join(' '));

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    copyLink: content.url
  };
}

/**
 * Generate Open Graph meta tags for shared content
 */
export function generateOGTags(content: ShareableContent): Record<string, string> {
  return {
    'og:title': content.title,
    'og:description': content.description,
    'og:url': content.url,
    'og:type': 'website',
    'og:site_name': 'Prize2Pride',
    'og:image': content.imageUrl || `${PLATFORM_URL}/og-image.png`,
    'twitter:card': 'summary_large_image',
    'twitter:title': content.title,
    'twitter:description': content.description,
    'twitter:image': content.imageUrl || `${PLATFORM_URL}/og-image.png`
  };
}

export type { ShareableContent, SocialShareLinks };
