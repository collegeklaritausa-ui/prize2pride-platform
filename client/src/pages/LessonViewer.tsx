/**
 * LessonViewer - Enhanced lesson display with clean HTML rendering and native voice audio
 * Prize2Pride American English Learning Platform
 * Marketed by CodinCloud
 */

import { useState, useRef, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipBack,
  SkipForward,
  BookOpen,
  Target,
  Lightbulb,
  Globe,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
  Zap,
  Award,
  MessageSquare,
  PenTool,
  Mic,
  Headphones,
  Sparkles,
  GraduationCap,
} from "lucide-react";

// Sample lesson data structure (would come from API)
interface LessonData {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  duration: number;
  xpReward: number;
  avatarId: string;
  category: string;
  objectives: string[];
  objectivesArabic?: string;
  content: string;
  culturalNotes?: string;
  vocabulary: {
    word: string;
    definition: string;
    example: string;
    translation?: string;
  }[];
  materials: string[];
  exercises: {
    id: number;
    type: string;
    question: string;
    options?: string[];
    correctAnswer: number | string;
    explanation: string;
    xpReward: number;
  }[];
}

// Level color configurations
const levelColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  A1: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", gradient: "from-emerald-500 to-teal-600" },
  A2: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", gradient: "from-blue-500 to-cyan-600" },
  B1: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", gradient: "from-violet-500 to-purple-600" },
  B2: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", gradient: "from-orange-500 to-amber-600" },
  C1: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", gradient: "from-rose-500 to-pink-600" },
  C2: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", gradient: "from-amber-500 to-yellow-500" },
};

export default function LessonViewer() {
  const { t } = useTranslation();
  const params = useParams();
  const [, setLocation] = useLocation();
  const lessonId = params.id || "";

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState("content");
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, number | string>>({});
  const [exerciseResults, setExerciseResults] = useState<Record<number, boolean>>({});

  // Sample lesson data (in production, this would come from API)
  const lessonData: LessonData = {
    id: "A1-U1-L1-VerbTenses",
    level: "A1",
    title: "Mastering Verb Tenses: The Path to American English Fluency",
    subtitle: "Unit 1: Hello, America!",
    duration: 60,
    xpReward: 100,
    avatarId: "nova",
    category: "grammar",
    objectives: [
      "<b>Identify and distinguish</b> between all major verb tenses in American English.",
      "<b>Correctly conjugate verbs</b> in simple, continuous, perfect, and perfect continuous tenses.",
      "<b>Apply appropriate verb tenses</b> in different contexts to express accurate time frames.",
      "<b>Recognize common errors</b> in tense usage and learn how to avoid them.",
      "<b>Enhance fluency and confidence</b> in speaking and writing.",
    ],
    objectivesArabic: "تحديد جميع أزمنة الأفعال في الإنجليزية الأمريكية والتمييز بينها، واستخدامها بشكل صحيح في الكلام والكتابة لزيادة الطلاقة والثقة.",
    content: `<h2 style="color:#2c3e50;">🎓 Mastering Verb Tenses: The Path to American English Fluency</h2>

<hr>

<h3 style="color:#1f618d;">📘 Core Content</h3>

<p style="color:#8b0000;">
<b>Explanation:</b> In American English, mastering verb tenses is essential for clear and precise communication.
English has <b>twelve primary verb tenses</b>, divided into four main groups.
</p>

<p style="color:#154360;">
<b>الشرح بالعربية:</b><br>
إتقان أزمنة الأفعال في الإنجليزية الأمريكية ضروري للتواصل الواضح والدقيق.
تحتوي اللغة الإنجليزية على <b>12 زمناً أساسياً</b> مقسمة إلى أربع مجموعات.
</p>

<hr>

<h3 style="color:#2874a6;">🕒 1. Present Tenses (الحاضر)</h3>
<ul>
  <li><b>Simple Present:</b> <i>I work</i>  
  <span style="color:#154360;">– أنا أعمل</span></li>

  <li><b>Present Continuous:</b> <i>I am working</i>  
  <span style="color:#154360;">– أنا أعمل الآن</span></li>

  <li><b>Present Perfect:</b> <i>I have worked</i>  
  <span style="color:#154360;">– لقد عملت</span></li>

  <li><b>Present Perfect Continuous:</b> <i>I have been working</i>  
  <span style="color:#154360;">– كنت أعمل وما زلت</span></li>
</ul>

<hr>

<h3 style="color:#2874a6;">⏳ 2. Past Tenses (الماضي)</h3>
<ul>
  <li><b>Simple Past:</b> <i>I worked</i>  
  <span style="color:#154360;">– عملت</span></li>

  <li><b>Past Continuous:</b> <i>I was working</i>  
  <span style="color:#154360;">– كنت أعمل</span></li>

  <li><b>Past Perfect:</b> <i>I had worked</i>  
  <span style="color:#154360;">– كنت قد عملت</span></li>

  <li><b>Past Perfect Continuous:</b> <i>I had been working</i>  
  <span style="color:#154360;">– كنت أعمل لفترة قبل حدث آخر</span></li>
</ul>

<hr>

<h3 style="color:#2874a6;">🚀 3. Future Tenses (المستقبل)</h3>
<ul>
  <li><b>Simple Future:</b> <i>I will work</i>  
  <span style="color:#154360;">– سأعمل</span></li>

  <li><b>Future Continuous:</b> <i>I will be working</i>  
  <span style="color:#154360;">– سأكون أعمل</span></li>

  <li><b>Future Perfect:</b> <i>I will have worked</i>  
  <span style="color:#154360;">– سأكون قد عملت</span></li>

  <li><b>Future Perfect Continuous:</b> <i>I will have been working</i>  
  <span style="color:#154360;">– سأكون أعمل لفترة زمنية</span></li>
</ul>

<hr>

<h3 style="color:#1f618d;">🧠 Understanding Usage</h3>

<p style="color:#8b0000;">
<b>Key Insight:</b><br>
• <b>Simple tenses</b> → facts & habits<br>
• <b>Continuous tenses</b> → actions in progress<br>
• <b>Perfect tenses</b> → completed actions with time connection<br>
• <b>Perfect continuous tenses</b> → duration of actions
</p>

<p style="color:#154360;">
<b>الخلاصة بالعربية:</b><br>
الأزمنة البسيطة للحقائق، والمستمرة للأحداث الجارية، 
والكاملة للأفعال المنتهية، والكاملة المستمرة للمدة الزمنية.
</p>

<hr>

<h3 style="color:#1f618d;">✍️ Example Sentences</h3>
<ul>
  <li><b>Present Simple:</b> She writes emails every day.</li>
  <li><b>Present Continuous:</b> She is writing an email now.</li>
  <li><b>Past Perfect:</b> She had written the report before the meeting.</li>
  <li><b>Future Perfect:</b> She will have finished the project by next week.</li>
</ul>`,
    culturalNotes: `<p style="color:#8b0000;">
In American culture, verb tense accuracy reflects clarity, professionalism, and respect for time.
Correct tense usage is essential in business, education, and everyday communication.
</p>

<p style="color:#154360;">
في الثقافة الأمريكية، الدقة في استخدام الأزمنة تعكس الاحترافية والوضوح واحترام الوقت،
وهي مهارة أساسية في العمل والحياة اليومية.
</p>`,
    vocabulary: [
      { word: "Verb Tense", definition: "A form of a verb that shows when an action happens", example: "The verb tense tells us if the action is in the past, present, or future.", translation: "زمن الفعل" },
      { word: "Conjugate", definition: "To change a verb form according to tense, person, or number", example: "You need to conjugate the verb 'to be' correctly: I am, you are, he is.", translation: "تصريف الفعل" },
      { word: "Simple Present", definition: "A tense used for habits, facts, and general truths", example: "I work every day. The sun rises in the east.", translation: "المضارع البسيط" },
      { word: "Present Continuous", definition: "A tense used for actions happening right now", example: "I am working on my homework right now.", translation: "المضارع المستمر" },
      { word: "Present Perfect", definition: "A tense connecting past actions to the present", example: "I have worked here for five years.", translation: "المضارع التام" },
      { word: "Simple Past", definition: "A tense used for completed actions in the past", example: "I worked yesterday.", translation: "الماضي البسيط" },
      { word: "Future Tense", definition: "A tense used for actions that will happen", example: "I will work tomorrow.", translation: "المستقبل" },
      { word: "Duration", definition: "The length of time something continues", example: "The duration of the meeting was two hours.", translation: "المدة الزمنية" },
    ],
    materials: ["Interactive exercises", "Sentence-building tasks", "Contextual quizzes", "Multilingual explanations (EN / AR)"],
    exercises: [
      { id: 1, type: "multiple_choice", question: "Which tense is used for actions happening right now?", options: ["Simple Present", "Present Continuous", "Present Perfect", "Simple Past"], correctAnswer: 1, explanation: "Present Continuous is used for actions happening at the moment of speaking.", xpReward: 10 },
      { id: 2, type: "multiple_choice", question: "Which sentence uses the Past Perfect correctly?", options: ["I had finished my homework before dinner.", "I have finished my homework before dinner.", "I finished my homework before dinner.", "I was finishing my homework before dinner."], correctAnswer: 0, explanation: "Past Perfect (had + past participle) is used for an action completed before another past action.", xpReward: 15 },
    ],
  };

  const colors = levelColors[lessonData.level] || levelColors.A1;

  // TTS mutation
  const generateAudio = trpc.tts.generateLessonAudio.useMutation({
    onSuccess: (data) => {
      setAudioUrl(data.audioUrl);
      setAudioLoading(false);
      toast.success("Audio generated successfully!");
    },
    onError: (error) => {
      setAudioLoading(false);
      toast.error("Failed to generate audio. Please try again.");
    },
  });

  // Strip HTML tags for audio generation
  const getPlainText = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleGenerateAudio = () => {
    if (audioUrl) {
      handlePlayPause();
      return;
    }
    setAudioLoading(true);
    const plainText = getPlainText(lessonData.content).slice(0, 4000);
    generateAudio.mutate({ content: plainText, avatarId: lessonData.avatarId });
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleExerciseAnswer = (exerciseId: number, answer: number | string) => {
    setExerciseAnswers({ ...exerciseAnswers, [exerciseId]: answer });
  };

  const checkExerciseAnswer = (exerciseId: number) => {
    const exercise = lessonData.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;
    const userAnswer = exerciseAnswers[exerciseId];
    const isCorrect = userAnswer === exercise.correctAnswer;
    setExerciseResults({ ...exerciseResults, [exerciseId]: isCorrect });
    if (isCorrect) {
      toast.success(`Correct! +${exercise.xpReward} XP`);
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Navigation */}
        <Link href="/courses">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Courses
          </Button>
        </Link>

        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl bg-gradient-to-r ${colors.gradient} p-8 text-white shadow-lg`}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Level {lessonData.level}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">
                  {lessonData.category}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {lessonData.title}
              </h1>
              <p className="text-white/80 text-lg">{lessonData.subtitle}</p>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{lessonData.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>{lessonData.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{lessonData.vocabulary.length} vocabulary words</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <GraduationCap className="h-8 w-8" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Audio Player Card */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
                  <Volume2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Native Voice Audio</h3>
                  <p className="text-slate-400">Listen to the lesson in American English</p>
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary border-0">
                HD Quality
              </Badge>
            </div>

            {/* Progress Bar */}
            {audioUrl && (
              <div className="space-y-3 mb-6">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={(value) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = value[0];
                      setCurrentTime(value[0]);
                    }
                  }}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!audioUrl ? (
                  <Button
                    onClick={handleGenerateAudio}
                    disabled={audioLoading}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg"
                  >
                    {audioLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Audio...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Generate & Play Audio
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime -= 10;
                        }
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={handlePlayPause}
                      className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime += 10;
                        }
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleRestart}
                      className="text-slate-400 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              {audioUrl && (
                <div className="flex items-center gap-4">
                  {/* Speed Control */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSpeedChange}
                    className="text-slate-400 hover:text-white"
                  >
                    {playbackSpeed}x
                  </Button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-slate-400 hover:text-white"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              onEnded={() => setIsPlaying(false)}
            />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Vocabulary
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="culture" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Culture
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              {/* Learning Objectives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    📌 Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {lessonData.objectives.map((objective, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: objective }} />
                      </motion.li>
                    ))}
                  </ul>
                  {lessonData.objectivesArabic && (
                    <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200 text-right" dir="rtl">
                        <b>الترجمة العربية:</b> {lessonData.objectivesArabic}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Main Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    📘 Lesson Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-slate max-w-none dark:prose-invert
                      prose-headings:font-bold
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-slate-800 dark:prose-h2:text-slate-200
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-blue-700 dark:prose-h3:text-blue-400
                      prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-4
                      prose-ul:space-y-2 prose-ul:my-4
                      prose-li:text-slate-600 dark:prose-li:text-slate-300
                      prose-strong:text-slate-800 dark:prose-strong:text-slate-200
                      prose-em:text-primary prose-em:not-italic
                      prose-hr:my-6 prose-hr:border-slate-200 dark:prose-hr:border-slate-700
                      [&_span]:inline"
                    dangerouslySetInnerHTML={{ __html: lessonData.content }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vocabulary Tab */}
          <TabsContent value="vocabulary">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    📚 Key Vocabulary
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTranslation(!showTranslation)}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {showTranslation ? "Hide" : "Show"} Arabic
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {lessonData.vocabulary.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg text-primary">{item.word}</h4>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.definition}
                      </p>
                      <p className="text-sm italic text-slate-600 dark:text-slate-400">
                        "{item.example}"
                      </p>
                      {showTranslation && item.translation && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 text-right font-semibold" dir="rtl">
                          {item.translation}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-primary" />
                  ✍️ Practice Exercises
                </CardTitle>
                <CardDescription>
                  Test your understanding with these interactive exercises
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {lessonData.exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-lg border bg-muted/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="capitalize">
                          {exercise.type.replace("_", " ")}
                        </Badge>
                        <Badge className="bg-primary/10 text-primary border-0">
                          +{exercise.xpReward} XP
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-lg mb-4">
                        {index + 1}. {exercise.question}
                      </h4>
                      {exercise.options && (
                        <div className="space-y-2">
                          {exercise.options.map((option, optIndex) => (
                            <Button
                              key={optIndex}
                              variant={exerciseAnswers[exercise.id] === optIndex ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto py-3 px-4 ${
                                exerciseResults[exercise.id] !== undefined
                                  ? optIndex === exercise.correctAnswer
                                    ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                                    : exerciseAnswers[exercise.id] === optIndex
                                    ? "bg-red-100 border-red-500 text-red-700"
                                    : ""
                                  : ""
                              }`}
                              onClick={() => handleExerciseAnswer(exercise.id, optIndex)}
                              disabled={exerciseResults[exercise.id] !== undefined}
                            >
                              <span className="mr-3 font-bold">{String.fromCharCode(65 + optIndex)}.</span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                      {exerciseAnswers[exercise.id] !== undefined && exerciseResults[exercise.id] === undefined && (
                        <Button
                          className="mt-4"
                          onClick={() => checkExerciseAnswer(exercise.id)}
                        >
                          Check Answer
                        </Button>
                      )}
                      {exerciseResults[exercise.id] !== undefined && (
                        <div className={`mt-4 p-4 rounded-lg ${
                          exerciseResults[exercise.id]
                            ? "bg-emerald-50 border border-emerald-200"
                            : "bg-amber-50 border border-amber-200"
                        }`}>
                          <p className={exerciseResults[exercise.id] ? "text-emerald-700" : "text-amber-700"}>
                            <b>Explanation:</b> {exercise.explanation}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Culture Tab */}
          <TabsContent value="culture">
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Globe className="h-5 w-5" />
                  🌎 Cultural Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-amber max-w-none"
                  dangerouslySetInnerHTML={{ __html: lessonData.culturalNotes || "" }}
                />
              </CardContent>
            </Card>

            {/* Materials */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  📦 Learning Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lessonData.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {material}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Footer */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Lesson
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Lesson Progress</p>
                <Progress value={45} className="w-32 h-2 mt-2" />
              </div>
              <Button className={`bg-gradient-to-r ${colors.gradient}`}>
                Next Lesson
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CodinCloud Branding */}
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">
            Prize2Pride American English Learning Platform
          </p>
          <p className="text-xs mt-1">
            Powered by <span className="font-semibold">CodinCloud</span> — Turning Ideas into Sophisticated Platforms
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
