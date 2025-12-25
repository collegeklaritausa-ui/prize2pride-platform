import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Star,
  Heart,
  BookOpen,
  Briefcase,
  Globe,
  Music,
  Mic,
  GraduationCap,
  Play,
  Volume2,
} from "lucide-react";

// Elegant Host Avatar Team - Professional mentors who welcome and guide learners
export const hostAvatars = [
  {
    id: "professor-emma",
    name: "Professor Emma",
    role: "Lead Grammar Expert",
    specialty: "Grammar & Academic English",
    personality: "Warm, patient, and incredibly knowledgeable",
    greeting: "Welcome to Prize2Pride! I'm Professor Emma, and I'll guide you through the beautiful intricacies of English grammar. Together, we'll transform complex rules into simple, memorable patterns.",
    voiceId: "nova",
    color: "from-rose-400 to-pink-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    icon: GraduationCap,
    traits: ["Patient", "Scholarly", "Encouraging"],
    avatarImage: "/avatars/professor-emma.png",
  },
  {
    id: "coach-sophia",
    name: "Coach Sophia",
    role: "Conversation Champion",
    specialty: "Speaking & Confidence Building",
    personality: "Energetic, motivating, and fun-loving",
    greeting: "Hey there, future English star! I'm Coach Sophia, your conversation partner and biggest cheerleader. Get ready to speak with confidence and have fun while doing it!",
    voiceId: "shimmer",
    color: "from-amber-400 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    icon: Mic,
    traits: ["Energetic", "Motivating", "Fun"],
    avatarImage: "/avatars/coach-sophia.png",
  },
  {
    id: "mentor-olivia",
    name: "Mentor Olivia",
    role: "Business English Specialist",
    specialty: "Professional & Business Communication",
    personality: "Calm, supportive, and insightful",
    greeting: "Welcome, ambitious learner. I'm Mentor Olivia, here to elevate your professional English. From boardroom presentations to email etiquette, I'll help you communicate with executive presence.",
    voiceId: "alloy",
    color: "from-slate-400 to-slate-700",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    icon: Briefcase,
    traits: ["Professional", "Insightful", "Supportive"],
    avatarImage: "/avatars/mentor-olivia.png",
  },
  {
    id: "guide-maya",
    name: "Guide Maya",
    role: "Cultural Navigator",
    specialty: "Idioms, Slang & American Culture",
    personality: "Curious, adventurous, and culturally savvy",
    greeting: "Hello, explorer! I'm Guide Maya, your passport to American culture and expressions. Ever wondered why Americans 'break a leg' for good luck? Let's discover the colorful world of English idioms together!",
    voiceId: "echo",
    color: "from-emerald-400 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: Globe,
    traits: ["Curious", "Adventurous", "Cultural"],
    avatarImage: "/avatars/guide-maya.png",
  },
  {
    id: "tutor-lily",
    name: "Tutor Lily",
    role: "Beginner's Best Friend",
    specialty: "Foundations & Beginner English",
    personality: "Gentle, encouraging, and patient",
    greeting: "Hi there, welcome! I'm Tutor Lily, and I'm so excited to start this journey with you. Don't worry if you're just beginning – every expert was once a beginner. Let's take it one step at a time!",
    voiceId: "fable",
    color: "from-violet-400 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    icon: Heart,
    traits: ["Gentle", "Patient", "Nurturing"],
    avatarImage: "/avatars/tutor-lily.png",
  },
  {
    id: "instructor-james",
    name: "Instructor James",
    role: "Pronunciation Master",
    specialty: "Pronunciation & Listening Skills",
    personality: "Charismatic, precise, and articulate",
    greeting: "Greetings, language enthusiast! I'm Instructor James, your guide to perfect American pronunciation. From subtle vowel sounds to confident intonation, we'll polish your accent to perfection.",
    voiceId: "onyx",
    color: "from-blue-400 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    icon: Volume2,
    traits: ["Charismatic", "Precise", "Articulate"],
    avatarImage: "/avatars/instructor-james.png",
  },
];

interface HostAvatarCardProps {
  avatar: typeof hostAvatars[0];
  isSelected: boolean;
  onSelect: () => void;
}

function HostAvatarCard({ avatar, isSelected, onSelect }: HostAvatarCardProps) {
  const Icon = avatar.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          isSelected
            ? `ring-2 ring-offset-2 ring-offset-background ${avatar.bgColor} shadow-xl`
            : "hover:shadow-lg"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar Icon/Image */}
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatar.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{avatar.name}</h3>
                {isSelected && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{avatar.role}</p>
              <div className="flex flex-wrap gap-1">
                {avatar.traits.map((trait) => (
                  <Badge
                    key={trait}
                    variant="outline"
                    className="text-xs px-2 py-0"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <p className="text-sm italic text-muted-foreground">
                "{avatar.greeting}"
              </p>
              <Button
                size="sm"
                className={`mt-3 bg-gradient-to-r ${avatar.color} text-white`}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Learning with {avatar.name.split(" ")[1]}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function HostAvatarsShowcase() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-secondary/20 text-secondary-foreground border-secondary/30">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Meet Your Hosts
          </Badge>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Personal{" "}
            <span className="bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
              AI Mentors
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet our elegant team of AI hosts, each with unique expertise and personality.
            They're always here to guide, encourage, and celebrate your progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hostAvatars.map((avatar) => (
            <HostAvatarCard
              key={avatar.id}
              avatar={avatar}
              isSelected={selectedAvatar === avatar.id}
              onSelect={() =>
                setSelectedAvatar(
                  selectedAvatar === avatar.id ? null : avatar.id
                )
              }
            />
          ))}
        </div>

        {/* Featured Host Welcome */}
        <AnimatePresence>
          {selectedAvatar && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ready to Begin?</h3>
                      <p className="text-sm text-muted-foreground">
                        Your selected host is excited to start your learning journey
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1">
                      <Play className="w-5 h-5 mr-2" />
                      Start First Lesson
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      <Music className="w-5 h-5 mr-2" />
                      Hear Introduction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Welcome Hero Component with Featured Hosts
export function WelcomeHero() {
  const featuredHosts = hostAvatars.slice(0, 2); // Emma and James as featured

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-rose-500/10 to-violet-500/10 border-rose-500/20">
              <Sparkles className="w-4 h-4 mr-2 text-rose-500" />
              Welcome to Prize2Pride
            </Badge>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Master{" "}
              <span className="bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                American English
              </span>{" "}
              with AI Mentors
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join millions of learners worldwide on the most advanced AI-powered
              language learning platform. Our elegant host avatars are ready to
              guide you from beginner to mastery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning Free
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                <Volume2 className="w-5 h-5 mr-2" />
                Hear Our Hosts
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                  10,000+
                </div>
                <div className="text-sm text-muted-foreground">
                  Interactive Lessons
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                  6
                </div>
                <div className="text-sm text-muted-foreground">
                  AI Host Mentors
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
                  1B+
                </div>
                <div className="text-sm text-muted-foreground">
                  Target Learners
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Hosts Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 grid gap-6">
              {featuredHosts.map((host, index) => (
                <motion.div
                  key={host.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                >
                  <Card className={`${host.bgColor} border-none shadow-xl`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${host.color} flex items-center justify-center shadow-lg`}
                        >
                          <host.icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-1">{host.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {host.specialty}
                          </p>
                          <p className="text-sm italic">"{host.greeting.slice(0, 100)}..."</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full opacity-20 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HostAvatarsShowcase;
