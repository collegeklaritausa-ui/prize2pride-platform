import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  MessageCircle, 
  Send,
  ArrowLeft,
  User,
  Bot,
  Briefcase,
  Plane,
  GraduationCap,
  Coffee,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const scenarios = [
  {
    id: 'coffee_shop',
    title: 'At the Coffee Shop',
    description: 'Order your favorite drink and make small talk with the barista',
    icon: Coffee,
    level: 'A1',
    context: 'You are at a coffee shop in New York City. Practice ordering drinks, asking about menu items, and making casual conversation.'
  },
  {
    id: 'job_interview',
    title: 'Job Interview',
    description: 'Practice answering common interview questions professionally',
    icon: Briefcase,
    level: 'B1',
    context: 'You are in a job interview for a position at a tech company. Practice introducing yourself, discussing your experience, and asking questions.'
  },
  {
    id: 'airport',
    title: 'At the Airport',
    description: 'Navigate check-in, security, and boarding conversations',
    icon: Plane,
    level: 'A2',
    context: 'You are at an international airport. Practice checking in for your flight, going through security, and asking for directions.'
  },
  {
    id: 'university',
    title: 'University Life',
    description: 'Discuss courses, campus life, and academic topics',
    icon: GraduationCap,
    level: 'B2',
    context: 'You are a student at an American university. Practice discussing your courses, asking professors questions, and talking with classmates.'
  }
];

const avatars = [
  { id: 'emma', name: 'Emma', specialty: 'Daily Conversation', personality: 'Friendly and patient American English teacher from California' },
  { id: 'james', name: 'James', specialty: 'Business English', personality: 'Professional business consultant from New York' },
  { id: 'sophia', name: 'Sophia', specialty: 'Travel English', personality: 'Enthusiastic travel blogger who loves sharing stories' },
  { id: 'michael', name: 'Michael', specialty: 'Academic English', personality: 'Patient professor with expertise in clear explanations' }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Practice() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<typeof avatars[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startConversation = trpc.conversation.start.useMutation();
  const sendMessage = trpc.conversation.sendMessage.useMutation();
  const endConversation = trpc.conversation.end.useMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartConversation = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!selectedScenario || !selectedAvatar) {
      toast.error('Please select a scenario and avatar');
      return;
    }

    try {
      const result = await startConversation.mutateAsync({
        scenarioId: selectedScenario.id,
        avatarId: selectedAvatar.id
      });
      
      setSessionId(result.sessionId ?? null);
      
      // Add initial greeting from avatar
      const greeting = `Hi! I'm ${selectedAvatar.name}. ${selectedScenario.context} Let's practice! How can I help you today?`;
      setMessages([{ role: 'assistant', content: greeting }]);
    } catch (error) {
      toast.error('Failed to start conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await sendMessage.mutateAsync({
        sessionId,
        message: userMessage,
        scenarioContext: selectedScenario?.context,
        avatarPersonality: selectedAvatar?.personality
      });

      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndConversation = async () => {
    if (!sessionId) return;

    try {
      const result = await endConversation.mutateAsync({
        sessionId,
        messages
      });

      toast.success(`Session complete! You earned ${result.xpEarned} XP`);
      setSessionId(null);
      setMessages([]);
      setSelectedScenario(null);
      setSelectedAvatar(null);
    } catch (error) {
      toast.error('Failed to end conversation');
    }
  };

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

  if (authLoading) {
    return <PracticeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
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
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/lessons" className="text-muted-foreground hover:text-foreground transition-colors">
              Lessons
            </Link>
            <Link href="/practice" className="text-foreground font-medium">
              Practice
            </Link>
            <Link href="/vocabulary" className="text-muted-foreground hover:text-foreground transition-colors">
              Vocabulary
            </Link>
          </div>

          {sessionId && (
            <Button variant="outline" onClick={handleEndConversation}>
              End Session
            </Button>
          )}
        </div>
      </nav>

      <main className="container py-8">
        {!sessionId ? (
          /* Selection Screen */
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Conversation Practice
              </h1>
              <p className="text-muted-foreground">
                Practice speaking with AI avatars in realistic scenarios
              </p>
            </div>

            {/* Scenario Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose a Scenario</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {scenarios.map((scenario) => (
                  <Card 
                    key={scenario.id}
                    className={`card-premium cursor-pointer transition-all ${
                      selectedScenario?.id === scenario.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <scenario.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{scenario.title}</h3>
                            <Badge className={levelBadgeColor(scenario.level)}>
                              {scenario.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {scenario.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose Your Conversation Partner</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {avatars.map((avatar) => (
                  <Card 
                    key={avatar.id}
                    className={`card-premium cursor-pointer transition-all ${
                      selectedAvatar?.id === avatar.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <CardContent className="p-5 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full gradient-navy flex items-center justify-center text-white text-xl font-semibold">
                        {avatar.name[0]}
                      </div>
                      <h3 className="font-semibold mb-1">{avatar.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {avatar.specialty}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="gradient-navy text-white hover:opacity-90 btn-glow h-14 px-10 text-lg"
                onClick={handleStartConversation}
                disabled={!selectedScenario || !selectedAvatar}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Conversation
              </Button>
              {(!selectedScenario || !selectedAvatar) && (
                <p className="text-sm text-muted-foreground mt-3">
                  Select a scenario and avatar to begin
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          /* Chat Interface */
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <Card className="card-premium h-[calc(100vh-12rem)]">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-navy flex items-center justify-center text-white font-semibold">
                    {selectedAvatar?.name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedAvatar?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedScenario?.title}</p>
                  </div>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 h-[calc(100%-10rem)]" ref={scrollRef}>
                <div className="p-4 space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'gradient-navy text-white'
                      }`}>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-white">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[44px] max-h-32 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    className="gradient-navy text-white h-[44px] px-4"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function PracticeSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center h-16">
          <Skeleton className="h-9 w-32" />
        </div>
      </nav>
      <main className="container py-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
