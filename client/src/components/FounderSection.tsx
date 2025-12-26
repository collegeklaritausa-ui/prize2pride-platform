/**
 * FounderSection - Showcases the platform founder with the sophisticated classroom poster
 * Prize2Pride American English Learning Platform
 * Marketed by CodinCloud
 */

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Award, 
  GraduationCap, 
  Globe, 
  Users, 
  BookOpen,
  Star,
  CheckCircle
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function FounderSection() {
  const { t } = useTranslation();

  const achievements = [
    { icon: GraduationCap, text: "Expert American English Educator" },
    { icon: Globe, text: "Multilingual Teaching Experience" },
    { icon: Users, text: "Thousands of Students Worldwide" },
    { icon: Award, text: "Certified Language Instructor" },
    { icon: BookOpen, text: "Comprehensive Curriculum Developer" },
    { icon: Star, text: "Award-Winning Teaching Methods" }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with founder image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/founder-classroom-poster.png)',
          filter: 'brightness(0.15)'
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-8"
          >
            <div>
              <Badge className="mb-4 px-4 py-1.5 bg-primary/20 text-primary border-primary/30">
                Meet Your Instructor
              </Badge>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Learn from the{" "}
                <span className="text-gradient">Best</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our founder brings years of experience in American English education, 
                combining traditional teaching methods with cutting-edge AI technology 
                to create the most effective learning experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-gray-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <achievement.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{achievement.text}</span>
                </motion.div>
              ))}
            </div>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Our Promise</h4>
                    <p className="text-gray-300 text-sm">
                      "Every lesson is crafted with care to help you achieve fluency 
                      in American English. Your success is our mission."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Founder Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/founder-classroom-poster.png" 
                alt="Prize2Pride Founder - American English Expert"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  Prize2Pride Academy
                </h3>
                <p className="text-gray-200">
                  American English Excellence
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className="bg-primary/80 text-white border-0">
                    Certified Instructor
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0">
                    Native-Level Teaching
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl"
            >
              <div className="text-3xl font-bold text-primary">600+</div>
              <div className="text-sm text-muted-foreground">Lessons Created</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl"
            >
              <div className="text-3xl font-bold text-primary">A1-C2</div>
              <div className="text-sm text-muted-foreground">All Levels</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CodinCloud Branding */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs">
        Marketed by CodinCloud
      </div>
    </section>
  );
}
