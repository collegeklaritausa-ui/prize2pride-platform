/**
 * Lesson File Loader - Prize2Pride Platform
 * Loads 301 lessons from JSON files in the courses directory
 * 
 * This module provides in-memory lesson data when database is not available
 */

import * as fs from 'fs';
import * as path from 'path';

export interface LessonData {
  id: number;
  fileId: string;
  title: string;
  subtitle?: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  duration: number;
  xpReward: number;
  order: number;
  isPublished: boolean;
  avatarId?: string;
  objectives: string[];
  content: string;
  vocabulary?: any[];
  exercises?: any[];
  culturalNotes?: string;
}

// Level to directory mapping
const levelDirs: Record<string, string> = {
  'A1': 'A1-Foundation',
  'A2': 'A2-Elementary',
  'B1': 'B1-Intermediate',
  'B2': 'B2-Upper-Intermediate',
  'C1': 'C1-Advanced',
  'C2': 'C2-Mastery'
};

// Category mapping from file content
const categoryMap: Record<string, string> = {
  'daily_conversation': 'daily_conversation',
  'business': 'business',
  'travel': 'travel',
  'academic': 'academic',
  'social': 'social',
  'culture': 'culture',
  'idioms': 'idioms',
  'pronunciation': 'pronunciation',
  'grammar': 'daily_conversation',
  'vocabulary': 'daily_conversation'
};

class LessonFileLoader {
  private lessons: LessonData[] = [];
  private loaded: boolean = false;
  private coursesPath: string;

  constructor() {
    this.coursesPath = path.resolve(process.cwd(), 'courses');
  }

  /**
   * Load all lessons from JSON files
   */
  async loadAllLessons(): Promise<LessonData[]> {
    if (this.loaded && this.lessons.length > 0) {
      return this.lessons;
    }

    console.log('[LessonLoader] Loading lessons from:', this.coursesPath);
    this.lessons = [];
    let lessonId = 1;

    for (const [level, dirName] of Object.entries(levelDirs)) {
      const lessonsDir = path.join(this.coursesPath, dirName, 'lessons');
      
      if (!fs.existsSync(lessonsDir)) {
        console.warn(`[LessonLoader] Directory not found: ${lessonsDir}`);
        continue;
      }

      const files = fs.readdirSync(lessonsDir)
        .filter(f => f.endsWith('.json'))
        .sort();

      for (const file of files) {
        try {
          const filePath = path.join(lessonsDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const lessonJson = JSON.parse(content);

          const lesson = this.transformLesson(lessonJson, lessonId, level as any, file);
          this.lessons.push(lesson);
          lessonId++;
        } catch (error) {
          console.error(`[LessonLoader] Error loading ${file}:`, error);
        }
      }
    }

    this.loaded = true;
    console.log(`[LessonLoader] Loaded ${this.lessons.length} lessons`);
    return this.lessons;
  }

  /**
   * Transform JSON lesson to LessonData format
   */
  private transformLesson(json: any, id: number, level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2', filename: string): LessonData {
    // Extract category from filename or content
    let category = 'daily_conversation';
    if (json.category) {
      category = categoryMap[json.category] || json.category;
    } else if (filename.includes('Business')) {
      category = 'business';
    } else if (filename.includes('Travel')) {
      category = 'travel';
    } else if (filename.includes('Academic')) {
      category = 'academic';
    }

    // Build content HTML from sections
    let contentHtml = '';
    if (json.content) {
      contentHtml = json.content;
    } else if (json.sections) {
      contentHtml = json.sections.map((s: any) => 
        `<h2>${s.title || ''}</h2><p>${s.content || s.text || ''}</p>`
      ).join('<hr/>');
    } else if (json.presentation?.sections) {
      contentHtml = json.presentation.sections.map((s: any) =>
        `<h2>${s.title}</h2><p>${s.content}</p>${s.examples ? '<ul>' + s.examples.map((e: string) => `<li>${e}</li>`).join('') + '</ul>' : ''}`
      ).join('<hr/>');
    }

    // Extract objectives
    let objectives: string[] = [];
    if (Array.isArray(json.objectives)) {
      objectives = json.objectives;
    } else if (json.learningObjectives) {
      objectives = json.learningObjectives;
    }

    return {
      id,
      fileId: filename.replace('.json', ''),
      title: json.title || json.lessonTitle || `Lesson ${id}`,
      subtitle: json.subtitle || json.topic || '',
      description: json.description || json.introduction?.text || objectives[0] || '',
      level,
      category,
      duration: json.duration || json.estimatedTime || 15,
      xpReward: json.xpReward || json.xp || 50,
      order: id,
      isPublished: true,
      avatarId: json.avatarId || json.hostId || 'host-couple-1',
      objectives,
      content: contentHtml,
      vocabulary: json.vocabulary || json.keyVocabulary || [],
      exercises: json.exercises || json.practice?.guidedExercises || [],
      culturalNotes: json.culturalNotes || json.extension?.culturalNotes || ''
    };
  }

  /**
   * Get all lessons with optional filters
   */
  async getAllLessons(filters?: { level?: string; category?: string }): Promise<LessonData[]> {
    await this.loadAllLessons();
    
    let result = this.lessons;
    
    if (filters?.level) {
      result = result.filter(l => l.level === filters.level);
    }
    if (filters?.category) {
      result = result.filter(l => l.category === filters.category);
    }
    
    return result;
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(id: number): Promise<LessonData | undefined> {
    await this.loadAllLessons();
    return this.lessons.find(l => l.id === id);
  }

  /**
   * Get lesson by file ID
   */
  async getLessonByFileId(fileId: string): Promise<LessonData | undefined> {
    await this.loadAllLessons();
    return this.lessons.find(l => l.fileId === fileId);
  }

  /**
   * Get lessons by level
   */
  async getLessonsByLevel(level: string): Promise<LessonData[]> {
    await this.loadAllLessons();
    return this.lessons.filter(l => l.level === level);
  }

  /**
   * Get lesson count
   */
  async getLessonCount(): Promise<number> {
    await this.loadAllLessons();
    return this.lessons.length;
  }
}

// Export singleton instance
export const lessonFileLoader = new LessonFileLoader();

// Export helper functions
export async function getAllLessonsFromFiles(filters?: { level?: string; category?: string }) {
  return lessonFileLoader.getAllLessons(filters);
}

export async function getLessonByIdFromFiles(id: number) {
  return lessonFileLoader.getLessonById(id);
}

export async function getLessonByFileIdFromFiles(fileId: string) {
  return lessonFileLoader.getLessonByFileId(fileId);
}
