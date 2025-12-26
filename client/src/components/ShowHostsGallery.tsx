import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Star,
  Play,
  Users,
  Globe,
  GraduationCap,
  Heart,
  ChevronRight,
} from "lucide-react";
import {
  allHostCouples,
  ethnicCouples,
  showCouples,
  lessonCouples,
  levelCouples,
  tunisianCouples,
  HostCouple,
} from "@/config/avatarConfig";

interface HostCoupleCardProps {
  couple: HostCouple;
  isSelected: boolean;
  onSelect: () => void;
}

function HostCoupleCard({ couple, isSelected, onSelect }: HostCoupleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-amber-500 ring-offset-2 shadow-xl shadow-amber-500/20"
            : "hover:shadow-lg hover:shadow-amber-500/10"
        }`}
      >
        {/* Host Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={couple.imagePath}
            alt={couple.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <Badge
            className="absolute top-3 left-3 bg-amber-500/90 text-white border-0"
          >
            {couple.category === 'tunisian' ? '🇹🇳 Tunisia' : 
             couple.category === 'level' ? `📚 ${couple.level}` :
             couple.category === 'lesson' ? '🎓 Lesson' : '🌍 Global'}
          </Badge>

          {/* Selected Indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500 text-white border-0">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Selected
              </Badge>
            </div>
          )}

          {/* Host Names */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-white text-lg drop-shadow-lg">
              {couple.maleName} & {couple.femaleName}
            </h3>
            <p className="text-white/80 text-sm drop-shadow-md">
              {couple.theme}
            </p>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {couple.description}
          </p>
          
          {couple.specialty && (
            <Badge variant="outline" className="mt-2 text-xs">
              {couple.specialty}
            </Badge>
          )}

          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Lesson with {couple.maleName} & {couple.femaleName}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ShowHostsGallery() {
  const [selectedCouple, setSelectedCouple] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const getCouplesForTab = (tab: string): HostCouple[] => {
    switch (tab) {
      case "tunisian":
        return tunisianCouples;
      case "ethnic":
        return [...ethnicCouples, ...showCouples];
      case "lesson":
        return lessonCouples;
      case "level":
        return levelCouples;
      default:
        return allHostCouples;
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black via-amber-950/20 to-black">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            64 Stunning Host Couples
          </Badge>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Meet Your{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Show Hosts
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Each lesson features a unique, elegant host couple in our spectacular 
            casino-show studio. Choose your favorites to guide your learning journey!
          </p>
          
          {/* Branding */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Prize2Pride
            </span>
            <span className="text-gray-500">×</span>
            <span className="text-xl font-semibold text-amber-400">
              Purchase2Win
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 bg-black/50 border border-amber-500/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              All (64)
            </TabsTrigger>
            <TabsTrigger value="tunisian" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              🇹🇳 Tunisia (20)
            </TabsTrigger>
            <TabsTrigger value="ethnic" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              Global (10)
            </TabsTrigger>
            <TabsTrigger value="lesson" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <GraduationCap className="w-4 h-4 mr-2" />
              Lessons (10)
            </TabsTrigger>
            <TabsTrigger value="level" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              📊 Levels (6)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Couples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {getCouplesForTab(activeTab).map((couple) => (
              <motion.div
                key={couple.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <HostCoupleCard
                  couple={couple}
                  isSelected={selectedCouple === couple.id}
                  onSelect={() =>
                    setSelectedCouple(
                      selectedCouple === couple.id ? null : couple.id
                    )
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to Start Learning?
              </h3>
              <p className="text-gray-400 mb-6">
                Your selected hosts are waiting to guide you through 300+ interactive lessons
              </p>
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                Begin Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ShowHostsGallery;
