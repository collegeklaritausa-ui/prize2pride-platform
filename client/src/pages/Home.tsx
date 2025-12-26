import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
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
import FounderSection from "@/components/FounderSection";

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
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageCircle,
      titleKey: "home.features.interactiveScenarios.title",
      descriptionKey: "home.features.interactiveScenarios.description"
    },
    {
      icon: Users,
      titleKey: "home.features.aiAvatars.title",
      descriptionKey: "home.features.aiAvatars.description"
    },
    {
      icon: Trophy,
      titleKey: "home.features.gamifiedLearning.title",
      descriptionKey: "home.features.gamifiedLearning.description"
    },
    {
      icon: BookMarked,
      titleKey: "home.features.structuredCurriculum.title",
      descriptionKey: "home.features.structuredCurriculum.description"
    },
    {
      icon: Headphones,
      titleKey: "home.features.listeningAndSpeaking.title",
      descriptionKey: "home.features.listeningAndSpeaking.description"
    },
    {
      icon: Zap,
      titleKey: "home.features.spacedRepetition.title",
      descriptionKey: "home.features.spacedRepetition.description"
    }
  ];

  const levels = [
    { level: "A1", nameKey: "home.levels.A1", color: "badge-a1" },
    { level: "A2", nameKey: "home.levels.A2", color: "badge-a2" },
    { level: "B1", nameKey: "home.levels.B1", color: "badge-b1" },
    { level: "B2", nameKey: "home.levels.B2", color: "badge-b2" },
    { level: "C1", nameKey: "home.levels.C1", color: "badge-c1" },
    { level: "C2", nameKey: "home.levels.C2", color: "badge-c2" }
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
              {t("common.appName")}
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/lessons" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.lessons")}
            </Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.practice")}
            </Link>
            <Link href="/vocabulary" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.vocabulary")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="gradient-navy text-white hover:opacity-90 btn-glow">
                  {t("nav.goToDashboard")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost" className="text-muted-foreground">
                    {t("nav.signIn")}
                  </Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button className="gradient-navy text-white hover:opacity-90 btn-glow">
                    {t("nav.getStarted")}
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Founder Background */}
      <section className="pt-32 pb-20 relative overflow-hidden min-h-[90vh]">
        {/* Founder Classroom Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/images/founder-classroom-poster.png)',
            filter: 'brightness(0.3)'
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
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
                {t("common.tagline")}
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
              variants={fadeInUp}
            >
              {t("home.heroTitle")}{" "}
              <span className="text-gradient">{t("home.heroTitleHighlight")}</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              {t("home.heroDescription")}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
                <Button size="lg" className="gradient-navy text-white hover:opacity-90 btn-glow h-14 px-8 text-lg">
                  {t("home.startLearning")}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
                <Play className="w-5 h-5 mr-2" />
                {t("home.watchDemo")}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">{t("home.stats.lessons")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">{t("home.stats.avatars")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">{t("home.stats.vocabulary")}</div>
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
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
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
                    <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
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
              {t("home.levels.title")}
            </Badge>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("home.levels.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.levels.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-premium text-center p-6 hover:scale-105 transition-transform cursor-pointer">
                  <div className={`text-3xl font-bold mb-2 ${level.color}`}>{level.level}</div>
                  <div className="text-sm text-muted-foreground">{t(level.nameKey)}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("home.testimonials.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.testimonials.subtitle")}
            </p>
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
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
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

      {/* Founder Section */}
      <FounderSection />

      {/* CTA Section */}
      <section className="py-24 gradient-navy text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("home.cta.title")}
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {t("home.cta.subtitle")}
            </p>
            <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg">
                {t("home.cta.button")}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">{t("common.appName")}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Prize2Pride. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
