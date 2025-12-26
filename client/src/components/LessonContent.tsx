import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Target,
  Lightbulb,
  Globe,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

interface LessonContentProps {
  lessonId: string;
  title: string;
  content: string; // HTML content
  objectives?: string[];
  culturalNotes?: string;
  vocabulary?: {
    word: string;
    definition: string;
    example: string;
    translation?: string;
  }[];
  level: string;
  avatarId?: string;
}

export default function LessonContent({
  lessonId,
  title,
  content,
  objectives = [],
  culturalNotes,
  vocabulary = [],
  level,
  avatarId = "nova",
}: LessonContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["content"]));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate audio for lesson content
  const generateAudio = trpc.tts.generateLessonAudio.useMutation({
    onSuccess: (data) => {
      setAudioUrl(data.audioUrl);
      setAudioLoading(false);
    },
    onError: () => {
      setAudioLoading(false);
    },
  });

  // Strip HTML tags for audio generation
  const getPlainText = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleGenerateAudio = () => {
    if (audioUrl) {
      // Audio already generated, just play
      handlePlayPause();
      return;
    }
    
    setAudioLoading(true);
    const plainText = getPlainText(content);
    generateAudio.mutate({ content: plainText, avatarId });
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

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const levelColors: Record<string, string> = {
    A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
    A2: "bg-blue-100 text-blue-700 border-blue-200",
    B1: "bg-violet-100 text-violet-700 border-violet-200",
    B2: "bg-orange-100 text-orange-700 border-orange-200",
    C1: "bg-rose-100 text-rose-700 border-rose-200",
    C2: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Native Voice Audio</h3>
                <p className="text-sm text-slate-400">Listen to the lesson in American English</p>
              </div>
            </div>
            <Badge className={levelColors[level] || levelColors.A1}>
              Level {level}
            </Badge>
          </div>

          {/* Audio Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            {audioUrl && (
              <div className="space-y-2">
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
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!audioUrl ? (
                  <Button
                    onClick={handleGenerateAudio}
                    disabled={audioLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {audioLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Audio...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate & Play Audio
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handlePlayPause}
                      className="w-12 h-12 rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
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

              {/* Volume Control */}
              {audioUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
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
              )}
            </div>
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

      {/* Learning Objectives */}
      {objectives.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("objectives")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                📌 Learning Objectives
              </CardTitle>
              {expandedSections.has("objectives") ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("objectives") && (
            <CardContent>
              <ul className="space-y-3">
                {objectives.map((objective, index) => (
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
            </CardContent>
          )}
        </Card>
      )}

      {/* Main Lesson Content */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection("content")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-primary" />
              📘 Lesson Content
            </CardTitle>
            {expandedSections.has("content") ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("content") && (
          <CardContent>
            {/* Translation Toggle */}
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
              >
                <Globe className="w-4 h-4 mr-2" />
                {showTranslation ? "Hide" : "Show"} Arabic Translation
              </Button>
            </div>
            
            {/* Rendered HTML Content */}
            <div 
              className="prose prose-slate max-w-none dark:prose-invert
                prose-headings:text-slate-800 dark:prose-headings:text-slate-200
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                prose-ul:space-y-2 prose-li:text-slate-600 dark:prose-li:text-slate-300
                prose-strong:text-slate-800 dark:prose-strong:text-slate-200
                prose-em:text-primary
                [&_hr]:my-6 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        )}
      </Card>

      {/* Vocabulary Section */}
      {vocabulary.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("vocabulary")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
                📚 Key Vocabulary
              </CardTitle>
              {expandedSections.has("vocabulary") ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("vocabulary") && (
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {vocabulary.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{item.word}</h4>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.definition}
                    </p>
                    <p className="text-sm italic text-primary">
                      "{item.example}"
                    </p>
                    {showTranslation && item.translation && (
                      <p className="text-sm text-blue-600 mt-2 text-right" dir="rtl">
                        {item.translation}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Cultural Notes */}
      {culturalNotes && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleSection("cultural")}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-800 dark:text-amber-200">
                <Globe className="w-5 h-5" />
                🌎 Cultural Notes
              </CardTitle>
              {expandedSections.has("cultural") ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("cultural") && (
            <CardContent>
              <div 
                className="prose prose-amber max-w-none"
                dangerouslySetInnerHTML={{ __html: culturalNotes }}
              />
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
