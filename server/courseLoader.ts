/**
 * Prize2Pride - Course Loader Utility
 * Loads and manages well-formatted course content
 * OMEGA777 2.5 - Eternal Platform
 */

import * as fs from 'fs';
import * as path from 'path';

// Course structure interfaces
export interface CourseVocabulary {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  example: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface CourseExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching' | 'ordering' | 'speaking' | 'listening' | 'writing';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface LessonContent {
  id: string;
  unitId: string;
  number: number;
  title: string;
  subtitle: string;
  duration: number; // minutes
  objectives: string[];
  prerequisites: string[];
  
  // Content sections
  introduction: {
    text: string;
    audioUrl?: string;
    videoUrl?: string;
  };
  
  warmUp: {
    activity: string;
    instructions: string;
    duration: number;
  };
  
  presentation: {
    sections: {
      title: string;
      content: string;
      examples: string[];
      visualAid?: string;
    }[];
  };
  
  practice: {
    guidedExercises: CourseExercise[];
    interactiveActivities: {
      type: string;
      description: string;
      instructions: string;
    }[];
  };
  
  production: {
    freeActivity: string;
    speakingPrompts?: string[];
    writingPrompts?: string[];
  };
  
  review: {
    keyPoints: string[];
    selfAssessment: CourseExercise[];
  };
  
  extension: {
    additionalResources: { title: string; url: string; type: string }[];
    challengeActivities: string[];
    culturalNotes: string;
  };
  
  vocabulary: CourseVocabulary[];
  grammarFocus?: string;
  avatarId: string;
  
  metadata: {
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

export interface CourseUnit {
  id: string;
  courseId: string;
  number: number;
  title: string;
  description: string;
  objectives: string[];
  lessons: LessonContent[];
  assessment: {
    type: 'quiz' | 'test' | 'project';
    questions: CourseExercise[];
    passingScore: number;
  };
  estimatedHours: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  
  overview: {
    introduction: string;
    targetAudience: string;
    prerequisites: string[];
    learningOutcomes: string[];
  };
  
  units: CourseUnit[];
  
  certification: {
    name: string;
    description: string;
    requirements: string[];
    validityPeriod: string;
  };
  
  metadata: {
    totalLessons: number;
    totalHours: number;
    totalVocabulary: number;
    totalExercises: number;
    version: string;
    lastUpdated: string;
  };
}

// Course loader class
export class CourseLoader {
  private coursesPath: string;
  private cache: Map<string, Course> = new Map();
  
  constructor(basePath: string = './courses') {
    this.coursesPath = path.resolve(basePath);
  }
  
  /**
   * Load all courses from the file system
   */
  async loadAllCourses(): Promise<Course[]> {
    const courses: Course[] = [];
    const levels = ['A1-Foundation', 'A2-Elementary', 'B1-Intermediate', 'B2-Upper-Intermediate', 'C1-Advanced', 'C2-Mastery'];
    
    for (const level of levels) {
      const coursePath = path.join(this.coursesPath, level);
      if (fs.existsSync(coursePath)) {
        const course = await this.loadCourse(level);
        if (course) {
          courses.push(course);
          this.cache.set(course.id, course);
        }
      }
    }
    
    return courses;
  }
  
  /**
   * Load a specific course by level
   */
  async loadCourse(levelDir: string): Promise<Course | null> {
    const coursePath = path.join(this.coursesPath, levelDir);
    const curriculumPath = path.join(coursePath, 'curriculum.md');
    
    if (!fs.existsSync(curriculumPath)) {
      console.warn(`Curriculum not found for ${levelDir}`);
      return null;
    }
    
    // Parse curriculum markdown
    const curriculumContent = fs.readFileSync(curriculumPath, 'utf-8');
    
    // Load units
    const unitsPath = path.join(coursePath, 'units');
    const units: CourseUnit[] = [];
    
    if (fs.existsSync(unitsPath)) {
      const unitFiles = fs.readdirSync(unitsPath).filter(f => f.endsWith('.json'));
      for (const unitFile of unitFiles) {
        const unitContent = fs.readFileSync(path.join(unitsPath, unitFile), 'utf-8');
        units.push(JSON.parse(unitContent));
      }
    }
    
    // Extract level code
    const levelCode = levelDir.split('-')[0] as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    const levelName = levelDir.split('-')[1];
    
    return {
      id: `course-${levelCode.toLowerCase()}`,
      code: levelCode,
      title: `${levelCode} ${levelName} Course`,
      subtitle: `American English ${levelName} Program`,
      description: this.extractDescription(curriculumContent),
      level: levelCode,
      overview: {
        introduction: this.extractSection(curriculumContent, 'Course Overview'),
        targetAudience: this.extractTargetAudience(levelCode),
        prerequisites: this.extractPrerequisites(levelCode),
        learningOutcomes: this.extractLearningOutcomes(curriculumContent),
      },
      units,
      certification: {
        name: `Prize2Pride ${levelCode} Certificate`,
        description: `Official certification of ${levelName} American English proficiency`,
        requirements: ['Complete all units', 'Pass final assessment with 70%+', 'Complete speaking evaluation'],
        validityPeriod: 'Lifetime',
      },
      metadata: {
        totalLessons: units.reduce((sum, u) => sum + u.lessons.length, 0) || 100,
        totalHours: this.getEstimatedHours(levelCode),
        totalVocabulary: this.getVocabularyCount(levelCode),
        totalExercises: units.reduce((sum, u) => sum + u.lessons.reduce((s, l) => s + l.practice.guidedExercises.length, 0), 0) || 500,
        version: '2.0',
        lastUpdated: new Date().toISOString(),
      },
    };
  }
  
  /**
   * Get a course from cache or load it
   */
  async getCourse(courseId: string): Promise<Course | null> {
    if (this.cache.has(courseId)) {
      return this.cache.get(courseId)!;
    }
    
    const levelMap: Record<string, string> = {
      'course-a1': 'A1-Foundation',
      'course-a2': 'A2-Elementary',
      'course-b1': 'B1-Intermediate',
      'course-b2': 'B2-Upper-Intermediate',
      'course-c1': 'C1-Advanced',
      'course-c2': 'C2-Mastery',
    };
    
    const levelDir = levelMap[courseId];
    if (levelDir) {
      return this.loadCourse(levelDir);
    }
    
    return null;
  }
  
  /**
   * Get lesson by ID
   */
  async getLesson(courseId: string, lessonId: string): Promise<LessonContent | null> {
    const course = await this.getCourse(courseId);
    if (!course) return null;
    
    for (const unit of course.units) {
      const lesson = unit.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    
    return null;
  }
  
  // Helper methods
  private extractDescription(content: string): string {
    const match = content.match(/## Course Overview\n\n([\s\S]*?)(?=\n##|\n---)/);
    return match ? match[1].trim() : 'Comprehensive American English course';
  }
  
  private extractSection(content: string, sectionName: string): string {
    const regex = new RegExp(`## ${sectionName}\\n\\n([\\s\\S]*?)(?=\\n##|\\n---|$)`);
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
  
  private extractLearningOutcomes(content: string): string[] {
    const section = this.extractSection(content, 'Learning Objectives');
    const outcomes = section.match(/\*\*[\w\s]+:\*\*\n([^\n]+)/g);
    return outcomes ? outcomes.map(o => o.replace(/\*\*/g, '').trim()) : [];
  }
  
  private extractTargetAudience(level: string): string {
    const audiences: Record<string, string> = {
      'A1': 'Absolute beginners with no prior English knowledge',
      'A2': 'Learners with basic English who want to expand their skills',
      'B1': 'Intermediate learners seeking independent communication ability',
      'B2': 'Upper-intermediate learners aiming for fluent interaction',
      'C1': 'Advanced learners pursuing professional-level English',
      'C2': 'Near-native speakers seeking mastery and refinement',
    };
    return audiences[level] || 'English language learners';
  }
  
  private extractPrerequisites(level: string): string[] {
    const prereqs: Record<string, string[]> = {
      'A1': ['No prior English knowledge required', 'Basic literacy in native language'],
      'A2': ['Completion of A1 or equivalent', 'Basic vocabulary of 500+ words'],
      'B1': ['Completion of A2 or equivalent', 'Ability to handle simple conversations'],
      'B2': ['Completion of B1 or equivalent', 'Independent language use capability'],
      'C1': ['Completion of B2 or equivalent', 'Fluent conversational ability'],
      'C2': ['Completion of C1 or equivalent', 'Advanced proficiency in all skills'],
    };
    return prereqs[level] || [];
  }
  
  private getEstimatedHours(level: string): number {
    const hours: Record<string, number> = {
      'A1': 100, 'A2': 120, 'B1': 180, 'B2': 200, 'C1': 250, 'C2': 300,
    };
    return hours[level] || 150;
  }
  
  private getVocabularyCount(level: string): number {
    const vocab: Record<string, number> = {
      'A1': 700, 'A2': 1200, 'B1': 2500, 'B2': 4000, 'C1': 6000, 'C2': 8000,
    };
    return vocab[level] || 2000;
  }
}

// Export singleton instance
export const courseLoader = new CourseLoader();

// Course statistics generator
export function generateCourseStats(course: Course) {
  return {
    courseId: course.id,
    level: course.level,
    totalUnits: course.units.length,
    totalLessons: course.metadata.totalLessons,
    totalHours: course.metadata.totalHours,
    totalVocabulary: course.metadata.totalVocabulary,
    totalExercises: course.metadata.totalExercises,
    completionRate: 0, // To be calculated per user
    averageScore: 0, // To be calculated per user
  };
}
