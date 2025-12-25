import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Zap,
  Brain,
  Infinity,
  Star,
  Rocket,
  Globe,
  Code,
  Cpu,
  Waves,
  ArrowRight,
  Play,
  Volume2,
  Download,
} from "lucide-react";

// Holographic background effect
function HolographicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random(),
        maxLife: Math.random() * 2 + 1,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Draw grid
      ctx.strokeStyle = "rgba(139, 92, 246, 0.1)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.01;

        if (p.life > p.maxLife) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 0,
            maxLife: Math.random() * 2 + 1,
            size: Math.random() * 2 + 1,
          };
        }

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connecting lines
      ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

// Floating card component
interface FloatingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FloatingCard({ icon, title, description, delay }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)" }}
    >
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm hover:border-purple-500/60 transition-all">
        <CardContent className="p-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
            {icon}
          </div>
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function FuturisticLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      <HolographicBackground />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-purple-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container flex items-center justify-between h-16 relative z-10">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Prize2Pride
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-purple-400 transition">
              Features
            </a>
            <a href="#lessons" className="hover:text-purple-400 transition">
              Lessons
            </a>
            <a href="#pricing" className="hover:text-purple-400 transition">
              Pricing
            </a>
          </div>

          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50">
            Get Started
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-6"
            >
              <Badge className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/50 text-purple-200">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Language Mastery
              </Badge>
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Master American English
              </span>
              <br />
              <span className="text-white">With AI Mentors</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              1,000+ interactive lessons powered by advanced AI. Learn from elegant mentors who adapt to your pace.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-purple-500/50 hover:bg-purple-500/10"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Floating stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 backdrop-blur">
                <div className="text-3xl font-bold text-purple-400">1,000+</div>
                <div className="text-sm text-gray-400">Interactive Lessons</div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 backdrop-blur">
                <div className="text-3xl font-bold text-blue-400">6</div>
                <div className="text-sm text-gray-400">AI Mentors</div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 backdrop-blur">
                <div className="text-3xl font-bold text-purple-400">∞</div>
                <div className="text-sm text-gray-400">Scalable</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4">
        <div className="container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Futuristic Learning
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Advanced AI technology meets elegant design
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FloatingCard
              icon={<Brain className="w-6 h-6 text-white" />}
              title="AI-Powered"
              description="Intelligent lessons that adapt to your learning style"
              delay={0}
            />
            <FloatingCard
              icon={<Infinity className="w-6 h-6 text-white" />}
              title="Unlimited Scale"
              description="100,000+ lessons covering every aspect of English"
              delay={0.1}
            />
            <FloatingCard
              icon={<Sparkles className="w-6 h-6 text-white" />}
              title="Elegant Mentors"
              description="6 unique AI hosts guide your learning journey"
              delay={0.2}
            />
            <FloatingCard
              icon={<Zap className="w-6 h-6 text-white" />}
              title="Lightning Fast"
              description="Optimized for speed and smooth performance"
              delay={0.3}
            />
            <FloatingCard
              icon={<Globe className="w-6 h-6 text-white" />}
              title="Global Reach"
              description="Designed for 1 billion learners worldwide"
              delay={0.4}
            />
            <FloatingCard
              icon={<Cpu className="w-6 h-6 text-white" />}
              title="Advanced Tech"
              description="Built with cutting-edge AI and web technologies"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Lessons Section */}
      <section id="lessons" className="relative py-24 px-4">
        <div className="container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Comprehensive Curriculum
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              From grammar to culture, we cover it all
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Code, title: "Grammar", count: "150+" },
              { icon: Waves, title: "Speaking", count: "120+" },
              { icon: Rocket, title: "Business", count: "100+" },
              { icon: Star, title: "Vocabulary", count: "180+" },
              { icon: Brain, title: "Academic", count: "140+" },
              { icon: Globe, title: "Culture", count: "110+" },
            ].map((category, i) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-2xl font-black text-purple-400">
                      {category.count}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Lessons</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Ready to Transform Your English?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of learners mastering American English with AI mentors
              </p>
              <Button
                size="lg"
                className="h-14 px-10 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-purple-500/20">
        <div className="container relative z-10 text-center text-gray-400">
          <p>
            © 2025 Prize2Pride. Augmenting Humanity Through Language Education.
          </p>
        </div>
      </footer>
    </div>
  );
}
