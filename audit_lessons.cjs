const fs = require('fs');
const path = require('path');

const coursesDir = './courses';
const generatedDir = './generated-lessons';

let totalLessons = 0;
let validLessons = 0;
let issues = [];

function validateLesson(filePath, content) {
  const errors = [];
  
  try {
    const lesson = JSON.parse(content);
    
    // Check required fields
    if (!lesson.id) errors.push('Missing id');
    if (!lesson.title) errors.push('Missing title');
    if (!lesson.level) errors.push('Missing level');
    if (!lesson.content) errors.push('Missing content');
    
    // Check for HTML content formatting
    if (lesson.content && typeof lesson.content === 'string') {
      if (!lesson.content.includes('<')) {
        errors.push('Content missing HTML formatting');
      }
    }
    
    // Check for bilingual support (Arabic)
    const hasArabic = lesson.objectivesArabic || 
                      (lesson.content && lesson.content.includes('العربية')) ||
                      (lesson.vocabulary && lesson.vocabulary.some(v => v.translation));
    if (!hasArabic) {
      errors.push('Missing Arabic translation support');
    }
    
    // Check vocabulary structure
    if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
      lesson.vocabulary.forEach((v, i) => {
        if (!v.word) errors.push(`Vocabulary ${i}: missing word`);
        if (!v.definition) errors.push(`Vocabulary ${i}: missing definition`);
      });
    }
    
    // Check exercises
    if (lesson.exercises && Array.isArray(lesson.exercises)) {
      lesson.exercises.forEach((e, i) => {
        if (!e.type) errors.push(`Exercise ${i}: missing type`);
        if (!e.question) errors.push(`Exercise ${i}: missing question`);
      });
    }
    
    return errors;
  } catch (e) {
    return ['Invalid JSON: ' + e.message];
  }
}

function scanDirectory(dir, prefix = '') {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, prefix + item + '/');
    } else if (item.endsWith('.json')) {
      totalLessons++;
      const content = fs.readFileSync(fullPath, 'utf8');
      const errors = validateLesson(fullPath, content);
      
      if (errors.length === 0) {
        validLessons++;
      } else {
        issues.push({
          file: prefix + item,
          errors: errors
        });
      }
    }
  }
}

console.log('=== Prize2Pride Lesson Content Audit ===\n');

// Scan courses directory
console.log('Scanning courses directory...');
scanDirectory(coursesDir, 'courses/');

// Scan generated-lessons directory
console.log('Scanning generated-lessons directory...');
scanDirectory(generatedDir, 'generated-lessons/');

console.log('\n=== AUDIT RESULTS ===');
console.log(`Total lessons found: ${totalLessons}`);
console.log(`Valid lessons: ${validLessons}`);
console.log(`Lessons with issues: ${issues.length}`);

if (issues.length > 0 && issues.length <= 20) {
  console.log('\n=== ISSUES FOUND ===');
  issues.forEach(issue => {
    console.log(`\nFile: ${issue.file}`);
    issue.errors.forEach(e => console.log(`  - ${e}`));
  });
} else if (issues.length > 20) {
  console.log(`\nToo many issues to display (${issues.length}). Showing first 10:`);
  issues.slice(0, 10).forEach(issue => {
    console.log(`\nFile: ${issue.file}`);
    issue.errors.forEach(e => console.log(`  - ${e}`));
  });
}

// Level distribution
console.log('\n=== LEVEL DISTRIBUTION ===');
const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

function countLevels(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      countLevels(fullPath);
    } else if (item.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (content.level && levelCounts.hasOwnProperty(content.level)) {
          levelCounts[content.level]++;
        }
      } catch (e) {}
    }
  }
}

countLevels(coursesDir);
countLevels(generatedDir);

Object.entries(levelCounts).forEach(([level, count]) => {
  console.log(`${level}: ${count} lessons`);
});

console.log(`\nTotal: ${Object.values(levelCounts).reduce((a, b) => a + b, 0)} lessons`);
