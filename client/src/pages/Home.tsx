import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  MessageCircle, 
  Trophy, 
  Sparkles, 
  Users, 
  Target,
  ChevronRight,
  Play,
  Star,
  Zap,
  Globe,
  Headphones,
  Mic,
  BookMarked
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: MessageCircle,
      title: "Interactive Scenarios",
      description: "Practice real-world American English conversations in immersive simulated scenarios"
    },
    {
      icon: Users,
      title: "AI Avatar Guides",
      description: "Learn with animated autonomous avatars that provide personalized feedback and guidance"
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and track your progress through engaging challenges"
    },
    {
      icon: BookMarked,
      title: "Structured Curriculum",
      description: "Lessons organized by proficiency levels (A1-C2) and practical topic categories"
    },
    {
      icon: Headphones,
      title: "Listening & Speaking",
      description: "Develop your comprehension and pronunciation with audio exercises"
    },
    {
      icon: Zap,
      title: "Spaced Repetition",
      description: "Master vocabulary with our intelligent flashcard system for lasting retention"
    }
  ];

  const levels = [
    { level: "A1", name: "Beginner", color: "badge-a1" },
    { level: "A2", name: "Elementary", color: "badge-a2" },
    { level: "B1", name: "Intermediate", color: "badge-b1" },
    { level: "B2", name: "Upper Intermediate", color: "badge-b2" },
    { level: "C1", name: "Advanced", color: "badge-c1" },
    { level: "C2", name: "Mastery", color: "badge-c2" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Business Professional",
      content: "Prize2Pride transformed my business English. The interactive scenarios helped me nail my presentations.",
      rating: 5
    },
    {
      name: "Carlos R.",
      role: "Graduate Student",
      content: "The avatar conversations feel so natural. I've gained confidence speaking English in just 3 months.",
      rating: 5
    },
    {
      name: "Yuki T.",
      role: "Travel Enthusiast",
      content: "Perfect for learning everyday American expressions. The gamification keeps me motivated daily!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Prize2Pride
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/lessons" className="text-muted-foreground hover:text-foreground transition-colors">
              Lessons
            </Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
              Practice
            </Link>
            <Link href="/vocabulary" className="text-muted-foreground hover:text-foreground transition-colors">
              Vocabulary
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="gradient-navy text-white hover:opacity-90 btn-glow">
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost" className="text-muted-foreground">
                    Sign In
                  </Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button className="gradient-navy text-white hover:opacity-90 btn-glow">
                    Get Started Free
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 px-4 py-1.5 text-sm bg-secondary/20 text-secondary-foreground border-secondary/30">
                <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Master American English with AI-Powered Learning
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
              variants={fadeInUp}
            >
              Transform Your English,{" "}
              <span className="text-gradient">Transform Your Life</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Experience the most sophisticated American English learning platform. 
              Interactive scenarios, AI-powered avatars, and personalized learning paths 
              designed for your success.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
                <Button size="lg" className="gradient-navy text-white hover:opacity-90 btn-glow h-14 px-8 text-lg">
                  Start Learning Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Interactive Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">AI Avatars</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">Vocabulary Words</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with proven 
              language learning methodologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-premium h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-secondary/20 text-secondary-foreground border-secondary/30">
              Proficiency Levels
            </Badge>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              From Beginner to Mastery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our curriculum follows the Common European Framework of Reference (CEFR) 
              to ensure structured progression.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {levels.map((item, index) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="card-premium">
                  <CardContent className="p-6">
                    <Badge className={`${item.color} text-lg font-bold px-4 py-2 mb-3`}>
                      {item.level}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Avatar Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                AI Avatars
              </Badge>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Meet Your Personal English Tutors
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI-powered avatars are more than just chatbots. They're intelligent 
                conversation partners designed to help you practice real-world scenarios, 
                correct your mistakes, and build your confidence.
              </p>
              
              <div className="space-y-4">
                {[
                  { name: "Emma", specialty: "Daily Conversation", desc: "Friendly Californian teacher" },
                  { name: "James", specialty: "Business English", desc: "NYC business consultant" },
                  { name: "Sophia", specialty: "Travel English", desc: "Enthusiastic travel blogger" },
                  { name: "Michael", specialty: "Academic English", desc: "Patient professor" }
                ].map((avatar, index) => (
                  <motion.div
                    key={avatar.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-white font-semibold">
                      {avatar.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{avatar.name}</div>
                      <div className="text-sm text-muted-foreground">{avatar.specialty} • {avatar.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl gradient-hero border border-border/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full gradient-navy flex items-center justify-center avatar-glow">
                    <MessageCircle className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Start a Conversation
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Practice speaking with AI avatars in realistic scenarios
                  </p>
                  <a href={isAuthenticated ? "/practice" : getLoginUrl()}>
                    <Button className="gradient-gold text-white hover:opacity-90">
                      <Mic className="w-4 h-4 mr-2" />
                      Try Conversation Practice
                    </Button>
                  </a>
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-2xl animate-float" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-xl animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-secondary/20 text-secondary-foreground border-secondary/30">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Loved by Learners Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-premium h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Transform Your English?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of learners who have achieved fluency with Prize2Pride. 
              Start your journey today—it's completely free.
            </p>
            <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
              <Button size="lg" className="gradient-gold text-white hover:opacity-90 h-14 px-10 text-lg btn-glow">
                Start Learning Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Prize2Pride
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/lessons" className="hover:text-foreground transition-colors">Lessons</Link>
              <Link href="/practice" className="hover:text-foreground transition-colors">Practice</Link>
              <Link href="/vocabulary" className="hover:text-foreground transition-colors">Vocabulary</Link>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 Prize2Pride. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
