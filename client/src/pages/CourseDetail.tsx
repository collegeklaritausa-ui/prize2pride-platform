import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  Lock,
  CheckCircle2,
  PlayCircle,
  Target,
  Sparkles,
  Users,
  FileText,
  Headphones,
  Mic,
  PenTool,
  MessageSquare,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react";

// Course data (would come from API in production)
const courseData: Record<string, {
  code: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  hours: number;
  vocabulary: number;
  avatarId: string;
  avatarName: string;
  units: {
    number: number;
    title: string;
    description: string;
    lessons: {
      number: number;
      title: string;
      duration: number;
      type: string;
      isCompleted: boolean;
      isLocked: boolean;
    }[];
    isCompleted: boolean;
    isLocked: boolean;
  }[];
  objectives: string[];
  prerequisites: string[];
  certification: {
    name: string;
    requirements: string[];
  };
}> = {
  a1: {
    code: "A1",
    name: "Foundation",
    subtitle: "Building Your English Base",
    description: "Start your journey with essential vocabulary, basic grammar, and survival English for everyday situations. This comprehensive course takes you from zero to confident basic communication.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    icon: "🌱",
    hours: 100,
    vocabulary: 700,
    avatarId: "tutor-lily",
    avatarName: "Tutor Lily",
    units: [
      {
        number: 1,
        title: "Hello, America!",
        description: "Learn the basics of English communication including greetings, introductions, and essential vocabulary.",
        lessons: [
          { number: 1, title: "The English Alphabet", duration: 60, type: "grammar", isCompleted: false, isLocked: false },
          { number: 2, title: "Greetings and Introductions", duration: 60, type: "conversation", isCompleted: false, isLocked: false },
          { number: 3, title: "Numbers 1-100", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 4, title: "Days and Months", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 5, title: "Telling Time", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 6, title: "Colors and Descriptions", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 7, title: "Family Members", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 8, title: "Common Objects", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 9, title: "Basic Verbs - Present Tense", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 10, title: "Questions and Answers", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
        ],
        isCompleted: false,
        isLocked: false,
      },
      {
        number: 2,
        title: "Daily Life",
        description: "Master vocabulary and expressions for daily routines, food, weather, and common activities.",
        lessons: [
          { number: 1, title: "Morning Routines", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 2, title: "Food and Meals", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 3, title: "At Home", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 4, title: "Weather and Seasons", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 5, title: "Clothing and Shopping", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
          { number: 6, title: "Transportation", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 7, title: "Asking for Directions", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
          { number: 8, title: "Places in the City", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 9, title: "Daily Activities", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 10, title: "Weekend Plans", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
        ],
        isCompleted: false,
        isLocked: true,
      },
      {
        number: 3,
        title: "About Me",
        description: "Learn to describe yourself, express preferences, and talk about personal information.",
        lessons: [
          { number: 1, title: "Personal Information", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
          { number: 2, title: "Hobbies and Interests", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 3, title: "Likes and Dislikes", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 4, title: "Abilities with Can", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 5, title: "Physical Descriptions", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 6, title: "Feelings and Emotions", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 7, title: "Health and Body", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 8, title: "Age and Birthday", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
          { number: 9, title: "Nationality and Origin", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 10, title: "Introducing Yourself", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
        ],
        isCompleted: false,
        isLocked: true,
      },
      {
        number: 4,
        title: "People & Places",
        description: "Expand your vocabulary for jobs, locations, and describing your environment.",
        lessons: [
          { number: 1, title: "Jobs and Occupations", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 2, title: "The Workplace", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 3, title: "School and Education", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 4, title: "My Neighborhood", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 5, title: "The City", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 6, title: "Countries and Cultures", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 7, title: "Buildings and Structures", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 8, title: "Rooms and Furniture", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 9, title: "Prepositions of Place", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 10, title: "Describing Locations", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
        ],
        isCompleted: false,
        isLocked: true,
      },
      {
        number: 5,
        title: "Time & Events",
        description: "Master time expressions, schedules, and talking about past and future events.",
        lessons: [
          { number: 1, title: "Daily Schedules", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 2, title: "Weekly Planning", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
          { number: 3, title: "Making Appointments", duration: 60, type: "conversation", isCompleted: false, isLocked: true },
          { number: 4, title: "American Holidays", duration: 60, type: "culture", isCompleted: false, isLocked: true },
          { number: 5, title: "Celebrations and Parties", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 6, title: "Simple Past Tense", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 7, title: "Future with Going To", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
          { number: 8, title: "Seasons and Weather", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 9, title: "Using the Calendar", duration: 60, type: "vocabulary", isCompleted: false, isLocked: true },
          { number: 10, title: "Frequency Adverbs", duration: 60, type: "grammar", isCompleted: false, isLocked: true },
        ],
        isCompleted: false,
        isLocked: true,
      },
    ],
    objectives: [
      "Introduce yourself and exchange basic personal information",
      "Handle simple everyday interactions with patient speakers",
      "Understand and use familiar everyday expressions",
      "Ask and answer questions about personal details",
      "Write simple phrases and sentences about yourself",
    ],
    prerequisites: [
      "No prior English knowledge required",
      "Basic literacy in your native language",
      "Motivation to learn and practice regularly",
    ],
    certification: {
      name: "Prize2Pride A1 Foundation Certificate",
      requirements: [
        "Complete all 5 units (50 lessons)",
        "Pass the final assessment with 70% or higher",
        "Complete the speaking evaluation",
        "Submit the writing portfolio",
      ],
    },
  },
};

// Lesson type icons
const lessonTypeIcons: Record<string, typeof BookOpen> = {
  grammar: BookOpen,
  vocabulary: FileText,
  conversation: MessageSquare,
  listening: Headphones,
  speaking: Mic,
  writing: PenTool,
  culture: Users,
};

// Lesson type colors
const lessonTypeColors: Record<string, string> = {
  grammar: "text-blue-600 bg-blue-100",
  vocabulary: "text-green-600 bg-green-100",
  conversation: "text-purple-600 bg-purple-100",
  listening: "text-orange-600 bg-orange-100",
  speaking: "text-pink-600 bg-pink-100",
  writing: "text-teal-600 bg-teal-100",
  culture: "text-amber-600 bg-amber-100",
};

export default function CourseDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.id?.toLowerCase() || "a1";
  const course = courseData[courseId] || courseData.a1;
  
  const [activeTab, setActiveTab] = useState("curriculum");
  
  // Calculate progress
  const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const completedLessons = course.units.reduce(
    (sum, unit) => sum + unit.lessons.filter(l => l.isCompleted).length,
    0
  );
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back button */}
        <Link href="/courses">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Courses
          </Button>
        </Link>

        {/* Course header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl bg-gradient-to-r ${course.color} p-8 text-white`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{course.icon}</span>
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Level {course.code}
                  </Badge>
                  <h1 className="text-3xl font-bold">{course.name} Course</h1>
                  <p className="text-white/80">{course.subtitle}</p>
                </div>
              </div>
              <p className="text-white/90 max-w-2xl">{course.description}</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-4xl font-bold">{progressPercent}%</p>
                <p className="text-white/80">Complete</p>
              </div>
              <Progress value={progressPercent} className="w-32 h-2 bg-white/20" />
              <p className="text-sm text-white/80">
                {completedLessons} of {totalLessons} lessons
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Clock className="h-5 w-5 mb-2" />
              <p className="text-2xl font-bold">{course.hours}h</p>
              <p className="text-sm text-white/80">Total Duration</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 mb-2" />
              <p className="text-2xl font-bold">{totalLessons}</p>
              <p className="text-sm text-white/80">Lessons</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Target className="h-5 w-5 mb-2" />
              <p className="text-2xl font-bold">{course.vocabulary}</p>
              <p className="text-sm text-white/80">Vocabulary</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Users className="h-5 w-5 mb-2" />
              <p className="text-2xl font-bold">{course.units.length}</p>
              <p className="text-sm text-white/80">Units</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
          </TabsList>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="mt-6">
            <div className="space-y-4">
              {course.units.map((unit, unitIndex) => (
                <motion.div
                  key={unit.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: unitIndex * 0.1 }}
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`unit-${unit.number}`} className="border rounded-lg">
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center font-bold
                            ${unit.isLocked 
                              ? "bg-muted text-muted-foreground" 
                              : unit.isCompleted 
                                ? "bg-green-100 text-green-700" 
                                : `${course.bgColor} ${course.textColor}`
                            }
                          `}>
                            {unit.isLocked ? (
                              <Lock className="h-5 w-5" />
                            ) : unit.isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              unit.number
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">Unit {unit.number}: {unit.title}</h3>
                            <p className="text-sm text-muted-foreground">{unit.description}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-2 mt-4">
                          {unit.lessons.map((lesson) => {
                            const TypeIcon = lessonTypeIcons[lesson.type] || BookOpen;
                            const typeColor = lessonTypeColors[lesson.type] || "text-gray-600 bg-gray-100";
                            
                            return (
                              <Link
                                key={lesson.number}
                                href={lesson.isLocked ? "#" : `/lessons/${courseId}-u${unit.number}-l${lesson.number}`}
                              >
                                <div className={`
                                  flex items-center justify-between p-4 rounded-lg border
                                  ${lesson.isLocked 
                                    ? "bg-muted/50 cursor-not-allowed" 
                                    : "hover:bg-muted/50 cursor-pointer"
                                  }
                                `}>
                                  <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeColor}`}>
                                      <TypeIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className={`font-medium ${lesson.isLocked ? "text-muted-foreground" : ""}`}>
                                        Lesson {lesson.number}: {lesson.title}
                                      </p>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{lesson.duration} min</span>
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {lesson.type}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    {lesson.isLocked ? (
                                      <Lock className="h-5 w-5 text-muted-foreground" />
                                    ) : lesson.isCompleted ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <PlayCircle className={`h-5 w-5 ${course.textColor}`} />
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Objectives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.objectives.map((objective, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className={`h-5 w-5 mt-0.5 ${course.textColor}`} />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.prerequisites.map((prereq, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Sparkles className={`h-5 w-5 mt-0.5 ${course.textColor}`} />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Your Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Your AI Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${course.bgColor} flex items-center justify-center text-2xl`}>
                    👩‍🏫
                  </div>
                  <div>
                    <h4 className="font-semibold">{course.avatarName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Your dedicated AI tutor for the {course.code} course, specializing in beginner-friendly instruction.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Course Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{course.hours}</p>
                      <p className="text-sm text-muted-foreground">Hours</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{totalLessons}</p>
                      <p className="text-sm text-muted-foreground">Lessons</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{course.vocabulary}</p>
                      <p className="text-sm text-muted-foreground">Words</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{course.units.length}</p>
                      <p className="text-sm text-muted-foreground">Units</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Certificate Tab */}
          <TabsContent value="certificate" className="mt-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Award className={`h-16 w-16 ${course.textColor}`} />
                </div>
                <CardTitle>{course.certification.name}</CardTitle>
                <CardDescription>
                  Complete this course to earn your official certificate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-lg border-2 border-dashed text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Your certificate will appear here once you complete all requirements
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {course.certification.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Certificates are recognized and can be shared on LinkedIn and other professional platforms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Start/Continue button */}
        <div className="flex justify-center">
          <Button size="lg" className={`bg-gradient-to-r ${course.color}`}>
            {progressPercent > 0 ? "Continue Learning" : "Start Course"}
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
