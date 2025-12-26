import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  Star,
  ChevronRight,
  Lock,
  CheckCircle2,
  PlayCircle,
  Target,
  Sparkles,
  Users,
  Globe,
  Mic,
  PenTool,
  Headphones,
  MessageSquare,
} from "lucide-react";

// Course level data
const courseLevels = [
  {
    code: "A1",
    name: "Foundation",
    subtitle: "Building Your English Base",
    description: "Start your journey with essential vocabulary, basic grammar, and survival English for everyday situations.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    icon: "🌱",
    hours: 100,
    lessons: 50,
    vocabulary: 700,
    skills: ["Basic Greetings", "Numbers & Time", "Simple Sentences", "Daily Vocabulary"],
    prerequisites: "None - Perfect for beginners!",
    certification: "A1 Foundation Certificate",
    progress: 0,
    isUnlocked: true,
  },
  {
    code: "A2",
    name: "Elementary",
    subtitle: "Expanding Your Communication",
    description: "Build on your foundation with everyday expressions, routine conversations, and practical language skills.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    icon: "🌿",
    hours: 120,
    lessons: 50,
    vocabulary: 1200,
    skills: ["Past Tense", "Future Plans", "Opinions", "Travel English"],
    prerequisites: "A1 completion or equivalent",
    certification: "A2 Elementary Certificate",
    progress: 0,
    isUnlocked: false,
  },
  {
    code: "B1",
    name: "Intermediate",
    subtitle: "Achieving Independence",
    description: "Develop independent communication skills, understand main points, and express yourself on familiar topics.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    icon: "🌳",
    hours: 180,
    lessons: 50,
    vocabulary: 2500,
    skills: ["Complex Grammar", "Professional Email", "Discussions", "News Understanding"],
    prerequisites: "A2 completion or equivalent",
    certification: "B1 Intermediate Certificate",
    progress: 0,
    isUnlocked: false,
  },
  {
    code: "B2",
    name: "Upper-Intermediate",
    subtitle: "Fluent Interaction",
    description: "Achieve fluent interaction with native speakers, understand complex texts, and express nuanced ideas.",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    icon: "🌲",
    hours: 200,
    lessons: 50,
    vocabulary: 4000,
    skills: ["Academic Writing", "Debate Skills", "Cultural Nuances", "Professional Presentations"],
    prerequisites: "B1 completion or equivalent",
    certification: "B2 Upper-Intermediate Certificate",
    progress: 0,
    isUnlocked: false,
  },
  {
    code: "C1",
    name: "Advanced",
    subtitle: "Professional Mastery",
    description: "Master implicit meanings, use language flexibly, and communicate effectively in professional contexts.",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    icon: "🏔️",
    hours: 250,
    lessons: 50,
    vocabulary: 6000,
    skills: ["Executive Communication", "Research Writing", "Negotiation", "Public Speaking"],
    prerequisites: "B2 completion or equivalent",
    certification: "C1 Advanced Certificate",
    progress: 0,
    isUnlocked: false,
  },
  {
    code: "C2",
    name: "Mastery",
    subtitle: "Near-Native Excellence",
    description: "Achieve near-native proficiency with nuanced expression, cultural mastery, and linguistic artistry.",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    icon: "👑",
    hours: 300,
    lessons: 50,
    vocabulary: 8000,
    skills: ["Idiomatic Mastery", "Literary Analysis", "Thought Leadership", "Cultural Fluency"],
    prerequisites: "C1 completion or equivalent",
    certification: "C2 Mastery Certificate",
    progress: 0,
    isUnlocked: false,
  },
];

// Skill categories
const skillCategories = [
  {
    id: "grammar",
    name: "Grammar Mastery",
    icon: BookOpen,
    description: "Master English grammar from basics to advanced structures",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "vocabulary",
    name: "Vocabulary & Expressions",
    icon: PenTool,
    description: "Build a rich vocabulary with idioms and expressions",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "speaking",
    name: "Speaking & Pronunciation",
    icon: Mic,
    description: "Develop clear American pronunciation and fluent speaking",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "listening",
    name: "Listening Comprehension",
    icon: Headphones,
    description: "Understand native speakers in various contexts",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    id: "writing",
    name: "Writing Excellence",
    icon: PenTool,
    description: "Write effectively for academic and professional purposes",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    id: "conversation",
    name: "Conversation & Culture",
    icon: MessageSquare,
    description: "Master real-world communication and American culture",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
];

// Course card component
function CourseCard({ course, index }: { course: typeof courseLevels[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${
        course.isUnlocked 
          ? "hover:shadow-xl cursor-pointer" 
          : "opacity-75"
      } ${course.borderColor}`}>
        {/* Gradient header */}
        <div className={`h-2 bg-gradient-to-r ${course.color}`} />
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{course.icon}</span>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className={`${course.textColor} ${course.borderColor}`}>
                    {course.code}
                  </Badge>
                  <span>{course.name}</span>
                </CardTitle>
                <CardDescription className="mt-1">{course.subtitle}</CardDescription>
              </div>
            </div>
            {!course.isUnlocked && (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
            {course.isUnlocked && course.progress === 100 && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{course.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`rounded-lg p-2 ${course.bgColor}`}>
              <Clock className={`h-4 w-4 mx-auto mb-1 ${course.textColor}`} />
              <p className="text-xs font-medium">{course.hours}h</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className={`rounded-lg p-2 ${course.bgColor}`}>
              <BookOpen className={`h-4 w-4 mx-auto mb-1 ${course.textColor}`} />
              <p className="text-xs font-medium">{course.lessons}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
            <div className={`rounded-lg p-2 ${course.bgColor}`}>
              <Target className={`h-4 w-4 mx-auto mb-1 ${course.textColor}`} />
              <p className="text-xs font-medium">{course.vocabulary}</p>
              <p className="text-xs text-muted-foreground">Words</p>
            </div>
          </div>

          {/* Skills preview */}
          <div className="flex flex-wrap gap-1">
            {course.skills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Progress bar */}
          {course.isUnlocked && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}

          {/* Action button */}
          <Link href={course.isUnlocked ? `/courses/${course.code.toLowerCase()}` : "#"}>
            <Button 
              className={`w-full ${course.isUnlocked ? `bg-gradient-to-r ${course.color} hover:opacity-90` : ""}`}
              variant={course.isUnlocked ? "default" : "secondary"}
              disabled={!course.isUnlocked}
            >
              {course.isUnlocked ? (
                <>
                  {course.progress > 0 ? "Continue Learning" : "Start Course"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-1" />
                  Complete {courseLevels[index - 1]?.code} to Unlock
                </>
              )}
            </Button>
          </Link>

          {/* Certification badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>{course.certification}</span>
          </div>
        </CardContent>

        {/* Hover effect */}
        <AnimatePresence>
          {isHovered && course.isUnlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-5 pointer-events-none`}
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Main Courses page
export default function Courses() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("levels");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            American English Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive courses designed to transform you into a confident, fluent speaker of American English
          </p>
          
          {/* Quick stats */}
          <div className="flex justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">300+</span>
              </div>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">1,150</span>
              </div>
              <p className="text-sm text-muted-foreground">Hours of Content</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">22,400</span>
              </div>
              <p className="text-sm text-muted-foreground">Vocabulary Words</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">6</span>
              </div>
              <p className="text-sm text-muted-foreground">Certificates</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="levels">By Level</TabsTrigger>
            <TabsTrigger value="skills">By Skill</TabsTrigger>
          </TabsList>

          {/* By Level */}
          <TabsContent value="levels" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseLevels.map((course, index) => (
                <CourseCard key={course.code} course={course} index={index} />
              ))}
            </div>
          </TabsContent>

          {/* By Skill */}
          <TabsContent value="skills" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-2`}>
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Explore Lessons
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning path visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Learning Journey
              </CardTitle>
              <CardDescription>
                Follow the structured path from beginner to mastery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {courseLevels.map((level, index) => (
                  <div key={level.code} className="flex items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                      ${level.isUnlocked 
                        ? `bg-gradient-to-r ${level.color} text-white` 
                        : "bg-muted text-muted-foreground"
                      }
                    `}>
                      {level.code}
                    </div>
                    {index < courseLevels.length - 1 && (
                      <ChevronRight className="h-5 w-5 text-muted-foreground mx-1" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Complete each level to unlock the next and earn your certificates
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-10 w-10 mx-auto text-primary mb-3" />
              <h3 className="font-semibold mb-2">AI Avatar Guides</h3>
              <p className="text-sm text-muted-foreground">
                Learn with 6 unique AI avatars, each specialized in different aspects of English
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Globe className="h-10 w-10 mx-auto text-primary mb-3" />
              <h3 className="font-semibold mb-2">American Culture</h3>
              <p className="text-sm text-muted-foreground">
                Immerse yourself in American culture, idioms, and real-world communication
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <GraduationCap className="h-10 w-10 mx-auto text-primary mb-3" />
              <h3 className="font-semibold mb-2">Official Certificates</h3>
              <p className="text-sm text-muted-foreground">
                Earn recognized certificates as you complete each proficiency level
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
