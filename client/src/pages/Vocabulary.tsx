import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  BookMarked, 
  ArrowLeft,
  Volume2,
  RotateCcw,
  Check,
  X,
  Plus,
  Search,
  Brain,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export default function Vocabulary() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'flashcards'>('browse');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());

  const { data: allVocabulary, isLoading: vocabLoading } = trpc.vocabulary.list.useQuery({
    level: selectedLevel !== 'all' ? selectedLevel as typeof levels[number] : undefined
  });

  const { data: userVocabulary } = trpc.vocabulary.getUserVocabulary.useQuery(undefined, {
    enabled: isAuthenticated
  });

  const { data: dueFlashcards, refetch: refetchDue } = trpc.vocabulary.getDueFlashcards.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  const addToCollection = trpc.vocabulary.addToCollection.useMutation({
    onSuccess: () => {
      toast.success('Word added to your collection!');
    }
  });

  const reviewFlashcard = trpc.vocabulary.reviewFlashcard.useMutation({
    onSuccess: () => {
      refetchDue();
    }
  });

  const filteredVocabulary = useMemo(() => {
    if (!allVocabulary) return [];
    return allVocabulary.filter(vocab =>
      vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.definition.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allVocabulary, searchQuery]);

  const userVocabIds = useMemo(() => {
    return new Set(userVocabulary?.map(uv => uv.vocab.id) || []);
  }, [userVocabulary]);

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

  const handleAddWord = (vocabId: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCollection.mutate({ vocabularyId: vocabId });
  };

  const handleReview = (quality: number) => {
    if (!dueFlashcards || dueFlashcards.length === 0) return;
    
    const currentCard = dueFlashcards[currentCardIndex];
    reviewFlashcard.mutate({
      vocabularyId: currentCard.vocab.id,
      quality
    });

    setReviewedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(currentCard.vocab.id);
      return newSet;
    });
    setIsFlipped(false);

    if (currentCardIndex < dueFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      toast.success('Review session complete!');
      setCurrentCardIndex(0);
      setReviewedCards(new Set());
    }
  };

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
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
              Practice
            </Link>
            <Link href="/vocabulary" className="text-foreground font-medium">
              Vocabulary
            </Link>
          </div>

          {isAuthenticated && dueFlashcards && dueFlashcards.length > 0 && (
            <Badge className="bg-primary text-primary-foreground">
              {dueFlashcards.length} cards due
            </Badge>
          )}
        </div>
      </nav>

      <main className="container py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Vocabulary Builder
            </h1>
            <p className="text-muted-foreground">
              Build your vocabulary with our spaced repetition flashcard system
            </p>
          </div>

          {/* Stats */}
          {isAuthenticated && userVocabulary && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{userVocabulary.length}</div>
                  <div className="text-sm text-muted-foreground">Words Saved</div>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {userVocabulary.filter(uv => uv.userVocab.status === 'mastered').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Mastered</div>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {dueFlashcards?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Due for Review</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-6">
              <TabsTrigger value="browse" className="gap-2">
                <BookMarked className="w-4 h-4" />
                Browse Words
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="gap-2">
                <Brain className="w-4 h-4" />
                Flashcards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vocabulary..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedLevel === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLevel('all')}
                    className={selectedLevel === 'all' ? 'gradient-navy text-white' : ''}
                  >
                    All
                  </Button>
                  {levels.map(level => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLevel(level)}
                      className={selectedLevel === level ? 'gradient-navy text-white' : ''}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Vocabulary List */}
              {vocabLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-xl" />
                  ))}
                </div>
              ) : filteredVocabulary.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVocabulary.map((vocab) => (
                    <Card key={vocab.id} className="card-premium">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{vocab.word}</h3>
                            {vocab.pronunciation && (
                              <p className="text-sm text-muted-foreground">{vocab.pronunciation}</p>
                            )}
                          </div>
                          <Badge className={levelBadgeColor(vocab.level)}>
                            {vocab.level}
                          </Badge>
                        </div>
                        
                        {vocab.partOfSpeech && (
                          <Badge variant="outline" className="mb-2 text-xs">
                            {vocab.partOfSpeech}
                          </Badge>
                        )}
                        
                        <p className="text-muted-foreground mb-3">{vocab.definition}</p>
                        
                        {vocab.exampleSentence && (
                          <p className="text-sm italic text-muted-foreground mb-4">
                            "{vocab.exampleSentence}"
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Volume2 className="w-4 h-4" />
                            Listen
                          </Button>
                          {!userVocabIds.has(vocab.id) ? (
                            <Button 
                              size="sm" 
                              className="gradient-navy text-white gap-1"
                              onClick={() => handleAddWord(vocab.id)}
                            >
                              <Plus className="w-4 h-4" />
                              Add
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                              <Check className="w-3 h-3 mr-1" />
                              Saved
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="card-premium">
                  <CardContent className="p-12 text-center">
                    <BookMarked className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-xl font-semibold mb-2">No vocabulary found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="flashcards">
              {!isAuthenticated ? (
                <Card className="card-premium max-w-md mx-auto">
                  <CardContent className="p-8 text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-xl font-semibold mb-2">Sign in to use flashcards</h3>
                    <p className="text-muted-foreground mb-6">
                      Create an account to save vocabulary and practice with spaced repetition
                    </p>
                    <a href={getLoginUrl()}>
                      <Button className="gradient-navy text-white">
                        Sign In
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ) : !dueFlashcards || dueFlashcards.length === 0 ? (
                <Card className="card-premium max-w-md mx-auto">
                  <CardContent className="p-8 text-center">
                    <Check className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                    <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                    <p className="text-muted-foreground mb-6">
                      No flashcards due for review. Add more words from the Browse tab!
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('browse')}
                    >
                      Browse Vocabulary
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="max-w-lg mx-auto">
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {currentCardIndex + 1} / {dueFlashcards.length}
                      </span>
                    </div>
                    <Progress 
                      value={((currentCardIndex + 1) / dueFlashcards.length) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Flashcard */}
                  <div 
                    className="relative h-80 cursor-pointer perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isFlipped ? 'back' : 'front'}
                        initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Card className="card-premium h-full">
                          <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                            {!isFlipped ? (
                              <>
                                <Badge className={`${levelBadgeColor(dueFlashcards[currentCardIndex].vocab.level)} mb-4`}>
                                  {dueFlashcards[currentCardIndex].vocab.level}
                                </Badge>
                                <h2 className="text-3xl font-bold mb-2">
                                  {dueFlashcards[currentCardIndex].vocab.word}
                                </h2>
                                {dueFlashcards[currentCardIndex].vocab.pronunciation && (
                                  <p className="text-muted-foreground">
                                    {dueFlashcards[currentCardIndex].vocab.pronunciation}
                                  </p>
                                )}
                                <p className="text-sm text-muted-foreground mt-4">
                                  Click to reveal definition
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-xl mb-4">
                                  {dueFlashcards[currentCardIndex].vocab.definition}
                                </p>
                                {dueFlashcards[currentCardIndex].vocab.exampleSentence && (
                                  <p className="text-sm italic text-muted-foreground">
                                    "{dueFlashcards[currentCardIndex].vocab.exampleSentence}"
                                  </p>
                                )}
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Rating Buttons */}
                  {isFlipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <p className="text-center text-sm text-muted-foreground mb-4">
                        How well did you know this word?
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        <Button 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleReview(1)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Again
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-orange-200 text-orange-600 hover:bg-orange-50"
                          onClick={() => handleReview(2)}
                        >
                          Hard
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleReview(3)}
                        >
                          Good
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleReview(5)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Easy
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
