import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  Zap,
  Clock,
  ArrowLeft,
  CheckCircle,
  Circle,
  Play,
  Volume2,
  Mic,
  PenTool,
  MessageSquare
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const lessonId = parseInt(id || '0');

  const { data: lessonData, isLoading } = trpc.lessons.getById.useQuery(
    { id: lessonId },
    { enabled: lessonId > 0 }
  );

  const { data: userProgress } = trpc.progress.getForLesson.useQuery(
    { lessonId },
    { enabled: isAuthenticated && lessonId > 0 }
  );

  const updateProgress = trpc.progress.update.useMutation({
    onSuccess: () => {
      toast.success("Progress saved!");
    }
  });

  useEffect(() => {
    if (userProgress?.status === 'in_progress') {
      setIsStarted(true);
      setCurrentStep(Math.floor((userProgress.progress / 100) * (lessonData?.exercises?.length || 1)));
    }
  }, [userProgress, lessonData]);

  const levelBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'badge-a1',
      'A2': 'badge-a2',
      'B1': 'badge-b1',
      'B2': 'badge-b2',
      'C1': 'badge-c1',
      'C2': 'badge-c2'
    };
    return colors[level] || 'badge-a1';
  };

  const exerciseIcon = (type: string) => {
    const icons: Record<string, any> = {
      'listening': Volume2,
      'speaking': Mic,
      'vocabulary': BookOpen,
      'grammar': PenTool,
      'fill_blank': MessageSquare,
      'multiple_choice': CheckCircle
    };
    return icons[type] || BookOpen;
  };

  const handleStartLesson = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setIsStarted(true);
    updateProgress.mutate({
      lessonId,
      status: 'in_progress',
      progress: 0
    });
  };

  const handleCompleteLesson = () => {
    updateProgress.mutate({
      lessonId,
      status: 'completed',
      progress: 100,
      score: 100,
      xpEarned: lessonData?.lesson?.xpReward || 50
    });
    toast.success(`Congratulations! You earned ${lessonData?.lesson?.xpReward || 50} XP!`);
    setLocation('/lessons');
  };

  if (isLoading) {
    return <LessonDetailSkeleton />;
  }

  if (!lessonData?.lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-premium max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The lesson you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/lessons">
              <Button className="gradient-navy text-white">
                Browse Lessons
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { lesson, content, exercises } = lessonData;
  const totalSteps = exercises?.length || 0;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/lessons">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Prize2Pride
              </span>
            </Link>
          </div>
          
          {isStarted && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {currentStep} / {totalSteps} exercises
              </div>
              <Progress value={progress} className="w-32 h-2" />
            </div>
          )}
        </div>
      </nav>

      <main className="container py-8">
        {!isStarted ? (
          /* Lesson Overview */
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={levelBadgeColor(lesson.level)}>
                  {lesson.level}
                </Badge>
                <Badge variant="outline">
                  {lesson.category.replace('_', ' ')}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {lesson.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {lesson.description}
              </p>
              
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{lesson.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>{lesson.xpReward} XP reward</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{totalSteps} exercises</span>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <Card className="card-premium mb-8">
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Real-world American English expressions and vocabulary</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Practical conversation skills for everyday situations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Cultural context and natural pronunciation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Exercise Preview */}
            {exercises && exercises.length > 0 && (
              <Card className="card-premium mb-8">
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exercises.map((exercise, index) => {
                      const Icon = exerciseIcon(exercise.type);
                      return (
                        <div 
                          key={exercise.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium capitalize">
                              {exercise.type.replace('_', ' ')} Exercise
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {exercise.question}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            +{exercise.xpReward} XP
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="gradient-navy text-white hover:opacity-90 btn-glow h-14 px-10 text-lg"
                onClick={handleStartLesson}
              >
                <Play className="w-5 h-5 mr-2" />
                {userProgress?.status === 'in_progress' ? 'Continue Lesson' : 'Start Lesson'}
              </Button>
              {userProgress?.status === 'completed' && (
                <p className="text-sm text-emerald-600 mt-3">
                  ✓ You've completed this lesson
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          /* Lesson In Progress */
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            {exercises && exercises.length > 0 && currentStep < exercises.length ? (
              <ExerciseCard
                exercise={exercises[currentStep]}
                onNext={() => {
                  if (currentStep < exercises.length - 1) {
                    setCurrentStep(currentStep + 1);
                    updateProgress.mutate({
                      lessonId,
                      status: 'in_progress',
                      progress: Math.round(((currentStep + 1) / exercises.length) * 100)
                    });
                  } else {
                    handleCompleteLesson();
                  }
                }}
                isLast={currentStep === exercises.length - 1}
              />
            ) : (
              <Card className="card-premium">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Lesson Complete!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Great job! You've completed all exercises in this lesson.
                  </p>
                  <Button 
                    className="gradient-navy text-white"
                    onClick={handleCompleteLesson}
                  >
                    Finish & Earn {lesson.xpReward} XP
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

function ExerciseCard({ 
  exercise, 
  onNext, 
  isLast 
}: { 
  exercise: any; 
  onNext: () => void; 
  isLast: boolean;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const options = exercise.options ? JSON.parse(exercise.options as string) : [];

  const handleSubmit = () => {
    const correct = selectedAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    onNext();
  };

  const Icon = (() => {
    const icons: Record<string, any> = {
      'listening': Volume2,
      'speaking': Mic,
      'vocabulary': BookOpen,
      'grammar': PenTool,
      'fill_blank': MessageSquare,
      'multiple_choice': CheckCircle
    };
    return icons[exercise.type] || BookOpen;
  })();

  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg capitalize">
              {exercise.type.replace('_', ' ')} Exercise
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              +{exercise.xpReward} XP
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">
          {exercise.question}
        </div>

        {options.length > 0 ? (
          <div className="space-y-3">
            {options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  showResult
                    ? option === exercise.correctAnswer
                      ? 'border-emerald-500 bg-emerald-50'
                      : option === selectedAnswer && !isCorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-border'
                    : selectedAnswer === option
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showResult
                      ? option === exercise.correctAnswer
                        ? 'border-emerald-500 bg-emerald-500'
                        : option === selectedAnswer && !isCorrect
                          ? 'border-red-500 bg-red-500'
                          : 'border-border'
                      : selectedAnswer === option
                        ? 'border-primary bg-primary'
                        : 'border-border'
                  }`}>
                    {(showResult && option === exercise.correctAnswer) || 
                     (!showResult && selectedAnswer === option) ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : null}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            disabled={showResult}
            placeholder="Type your answer..."
            className="w-full p-4 rounded-lg border-2 border-border focus:border-primary focus:outline-none"
          />
        )}

        {showResult && exercise.explanation && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <p className="font-medium mb-1">
              {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
            </p>
            <p className="text-sm text-muted-foreground">
              {exercise.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!showResult ? (
            <Button 
              className="gradient-navy text-white"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
            >
              Check Answer
            </Button>
          ) : (
            <Button 
              className="gradient-navy text-white"
              onClick={handleNext}
            >
              {isLast ? 'Complete Lesson' : 'Next Exercise'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LessonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center h-16">
          <Skeleton className="h-9 w-32" />
        </div>
      </nav>
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-20 w-full mb-6" />
          <div className="flex gap-6 mb-8">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}
