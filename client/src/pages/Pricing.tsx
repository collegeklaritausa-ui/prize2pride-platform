/**
 * Pricing Page - Prize2Pride Subscription Packages
 * 
 * 6 Stunning Subscription Tiers:
 * - Freemium: Free (1 hour daily limit)
 * - Bronze: $5/month
 * - Silver: $10/month
 * - Gold: $50/month
 * - Diamond: $50/month
 * - VIP Millionaire: $100/month
 * 
 * Marketed by CodinCloud — Turning Ideas into Sophisticated Platforms
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check, X, Sparkles, Crown, Diamond, Star, Zap, Shield,
  Clock, Users, Headphones, BookOpen, MessageSquare, Award,
  Globe, Mic, Video, ChevronDown, ChevronUp, Gift, Infinity
} from 'lucide-react';
import { toast } from 'sonner';

// Subscription package data
import type { LucideIcon } from 'lucide-react';

interface SubscriptionPackage {
  id: string;
  name: string;
  displayName: string;
  priceMonthly: number;
  priceYearly: number;
  dailyLimitMinutes: number;
  dailyLimitDisplay: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  features: { text: string; included: boolean }[];
  popular: boolean;
}

const subscriptionPackages: SubscriptionPackage[] = [
  {
    id: 'freemium',
    name: 'Freemium',
    displayName: 'Free Starter',
    priceMonthly: 0,
    priceYearly: 0,
    dailyLimitMinutes: 60, // 1 hour
    dailyLimitDisplay: '1 Hour',
    description: 'Perfect for trying out the platform',
    icon: Gift,
    color: '#6b7280',
    gradient: 'from-gray-500 to-gray-600',
    bgGradient: 'from-gray-900/50 to-gray-800/30',
    borderColor: 'border-gray-600',
    features: [
      { text: '1 Hour Daily Learning', included: true },
      { text: 'Access to A1 Lessons', included: true },
      { text: 'Basic Vocabulary', included: true },
      { text: 'Community Forum Access', included: true },
      { text: 'TTS Audio (Limited)', included: true },
      { text: 'Progress Tracking', included: false },
      { text: 'AI Conversation Practice', included: false },
      { text: 'Premium Host Couples', included: false },
      { text: 'Certificates', included: false },
      { text: 'Priority Support', included: false },
    ],
    popular: false,
  },
  {
    id: 'bronze',
    name: 'Bronze',
    displayName: 'Bronze Learner',
    priceMonthly: 5,
    priceYearly: 50,
    dailyLimitMinutes: 480, // 8 hours
    dailyLimitDisplay: '8 Hours',
    description: 'Great for casual learners',
    icon: Shield,
    color: '#cd7f32',
    gradient: 'from-amber-700 to-amber-800',
    bgGradient: 'from-amber-900/40 to-amber-800/20',
    borderColor: 'border-amber-700',
    features: [
      { text: '8 Hours Daily Learning', included: true },
      { text: 'Access to A1-A2 Lessons', included: true },
      { text: 'Extended Vocabulary', included: true },
      { text: 'Community Forum Access', included: true },
      { text: 'TTS Audio (Full)', included: true },
      { text: 'Progress Tracking', included: true },
      { text: 'AI Conversation Practice', included: false },
      { text: 'Premium Host Couples', included: false },
      { text: 'Certificates', included: false },
      { text: 'Priority Support', included: false },
    ],
    popular: false,
  },
  {
    id: 'silver',
    name: 'Silver',
    displayName: 'Silver Scholar',
    priceMonthly: 10,
    priceYearly: 100,
    dailyLimitMinutes: 960, // 16 hours
    dailyLimitDisplay: '16 Hours',
    description: 'Ideal for dedicated students',
    icon: Star,
    color: '#c0c0c0',
    gradient: 'from-slate-400 to-slate-500',
    bgGradient: 'from-slate-800/50 to-slate-700/30',
    borderColor: 'border-slate-400',
    features: [
      { text: '16 Hours Daily Learning', included: true },
      { text: 'Access to A1-B1 Lessons', included: true },
      { text: 'Full Vocabulary Library', included: true },
      { text: 'Community Forum Access', included: true },
      { text: 'TTS Audio (HD Quality)', included: true },
      { text: 'Progress Tracking', included: true },
      { text: 'AI Conversation Practice', included: true },
      { text: 'Premium Host Couples', included: false },
      { text: 'Certificates', included: false },
      { text: 'Priority Support', included: false },
    ],
    popular: false,
  },
  {
    id: 'gold',
    name: 'Gold',
    displayName: 'Gold Master',
    priceMonthly: 50,
    priceYearly: 500,
    dailyLimitMinutes: -1, // Unlimited
    dailyLimitDisplay: 'Unlimited',
    description: 'For serious language enthusiasts',
    icon: Crown,
    color: '#ffd700',
    gradient: 'from-yellow-500 to-amber-500',
    bgGradient: 'from-yellow-900/40 to-amber-900/30',
    borderColor: 'border-yellow-500',
    features: [
      { text: 'Unlimited Daily Learning', included: true },
      { text: 'Access to A1-B2 Lessons', included: true },
      { text: 'Full Vocabulary Library', included: true },
      { text: 'VIP Forum Access', included: true },
      { text: 'TTS Audio (HD Quality)', included: true },
      { text: 'Advanced Progress Analytics', included: true },
      { text: 'AI Conversation Practice', included: true },
      { text: 'Premium Host Couples', included: true },
      { text: 'Certificates', included: true },
      { text: 'Priority Support', included: false },
    ],
    popular: true,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    displayName: 'Diamond Elite',
    priceMonthly: 50,
    priceYearly: 500,
    dailyLimitMinutes: -1, // Unlimited
    dailyLimitDisplay: 'Unlimited',
    description: 'Premium features for excellence',
    icon: Diamond,
    color: '#b9f2ff',
    gradient: 'from-cyan-400 to-blue-500',
    bgGradient: 'from-cyan-900/40 to-blue-900/30',
    borderColor: 'border-cyan-400',
    features: [
      { text: 'Unlimited Daily Learning', included: true },
      { text: 'Access to ALL Lessons (A1-C2)', included: true },
      { text: 'Full Vocabulary + Idioms', included: true },
      { text: 'VIP Forum + Live Events', included: true },
      { text: 'TTS Audio (Ultra HD)', included: true },
      { text: 'Advanced Progress Analytics', included: true },
      { text: 'Unlimited AI Conversations', included: true },
      { text: 'All 64 Host Couples', included: true },
      { text: 'Premium Certificates', included: true },
      { text: 'Extended Tutoring Sessions', included: true },
    ],
    popular: false,
  },
  {
    id: 'vip_millionaire',
    name: 'VIP Millionaire',
    displayName: 'VIP Millionaire',
    priceMonthly: 100,
    priceYearly: 1000,
    dailyLimitMinutes: -1, // Unlimited
    dailyLimitDisplay: 'Unlimited',
    description: 'The ultimate learning experience',
    icon: Sparkles,
    color: '#ff00ff',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    bgGradient: 'from-purple-900/50 via-pink-900/40 to-rose-900/30',
    borderColor: 'border-purple-400',
    features: [
      { text: 'Unlimited Everything', included: true },
      { text: 'All Lessons + Exclusive Content', included: true },
      { text: 'Complete Learning Library', included: true },
      { text: 'Private VIP Community', included: true },
      { text: 'TTS Audio (Studio Quality)', included: true },
      { text: 'Personal Learning Dashboard', included: true },
      { text: 'Unlimited AI + Live Tutoring', included: true },
      { text: 'All 64 Host Couples + Tunisian', included: true },
      { text: 'Gold-Embossed Certificates', included: true },
      { text: '24/7 Priority Support', included: true },
    ],
    popular: false,
  },
];

// FAQ data
const faqItems = [
  {
    question: 'What is the difference between monthly and yearly billing?',
    answer: 'Yearly billing gives you 2 months free compared to monthly billing. You pay for 10 months and get 12 months of access.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can change your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at the end of your current billing period.',
  },
  {
    question: 'What happens when I reach my daily limit on Freemium?',
    answer: 'Once you reach your 1-hour daily limit, you\'ll need to wait until the next day to continue learning, or upgrade to a paid plan for more learning time.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 7-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers through our secure Stripe payment system.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Absolutely! All payments are processed through Stripe, which is PCI-DSS Level 1 certified - the highest level of security certification.',
  },
];

export default function Pricing() {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleSubscribe = (packageId: string) => {
    setSelectedPackage(packageId);
    if (packageId === 'freemium') {
      toast.success('Welcome to Prize2Pride! Your free account is ready.');
    } else {
      toast.info('Redirecting to secure checkout...', {
        description: 'Stripe payment integration coming soon!'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#b9f2ff' : '#ff00ff',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge 
                className="mb-4 px-4 py-2 text-sm"
                style={{ 
                  background: 'linear-gradient(135deg, #ffd700, #b8860b)',
                  color: '#000'
                }}
              >
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Choose Your Learning Journey
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
                  Prize2Pride
                </span>
                <br />
                <span className="text-white">Subscription Plans</span>
              </h1>

              <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
                Unlock your American English potential with our flexible subscription plans.
                From free starter to VIP Millionaire - there's a perfect plan for everyone.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-lg ${!isYearly ? 'text-white' : 'text-white/50'}`}>Monthly</span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-500 data-[state=checked]:to-amber-500"
                />
                <span className={`text-lg ${isYearly ? 'text-white' : 'text-white/50'}`}>
                  Yearly
                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                    Save 17%
                  </Badge>
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {pkg.popular && (
                    <div 
                      className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full text-sm font-bold"
                      style={{ 
                        background: `linear-gradient(135deg, ${pkg.color}, #b8860b)`,
                        color: '#000'
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  <Card
                    className={`h-full overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      pkg.popular ? 'ring-2 ring-yellow-500/50' : ''
                    }`}
                    style={{
                      borderColor: pkg.color + '60',
                      background: `linear-gradient(135deg, rgba(15,15,35,0.95), rgba(26,26,46,0.9))`,
                    }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${pkg.color}40, ${pkg.color}20)`,
                            border: `1px solid ${pkg.color}60`
                          }}
                        >
                          <pkg.icon className="w-6 h-6" style={{ color: pkg.color }} />
                        </div>
                        <Badge 
                          variant="outline"
                          style={{ borderColor: pkg.color, color: pkg.color }}
                        >
                          {pkg.dailyLimitDisplay}
                        </Badge>
                      </div>

                      <CardTitle className="text-2xl font-bold text-white">
                        {pkg.displayName}
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        {pkg.description}
                      </CardDescription>

                      <div className="mt-4">
                        <div className="flex items-baseline gap-2">
                          <span 
                            className="text-4xl font-bold"
                            style={{ color: pkg.color }}
                          >
                            ${isYearly ? Math.round(pkg.priceYearly / 12) : pkg.priceMonthly}
                          </span>
                          <span className="text-white/50">/month</span>
                        </div>
                        {isYearly && pkg.priceYearly > 0 && (
                          <p className="text-sm text-white/50 mt-1">
                            ${pkg.priceYearly} billed yearly
                          </p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <ul className="space-y-3">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            {feature.included ? (
                              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            ) : (
                              <X className="w-5 h-5 text-white/30 flex-shrink-0" />
                            )}
                            <span className={feature.included ? 'text-white/80' : 'text-white/40'}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full h-12 text-lg font-semibold transition-all duration-300"
                        style={{
                          background: pkg.id === 'freemium' 
                            ? 'rgba(255,255,255,0.1)' 
                            : `linear-gradient(135deg, ${pkg.color}, ${pkg.color}cc)`,
                          color: pkg.id === 'freemium' ? '#fff' : '#000',
                          boxShadow: pkg.id !== 'freemium' ? `0 0 30px ${pkg.color}40` : 'none'
                        }}
                        onClick={() => handleSubscribe(pkg.id)}
                      >
                        {pkg.id === 'freemium' ? 'Start Free' : 'Subscribe Now'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="px-4 py-16 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose <span className="text-yellow-400">Prize2Pride</span>?
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Our platform offers the most comprehensive American English learning experience
                with stunning host couples and cutting-edge AI technology.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, title: '64 Host Couples', description: 'Learn from diverse, hyper-realistic hosts', color: '#ffd700' },
                { icon: Mic, title: 'TTS-1-HD Nova', description: 'Crystal-clear American English pronunciation', color: '#3b82f6' },
                { icon: BookOpen, title: '301 Lessons', description: 'Comprehensive A1-C2 curriculum', color: '#10b981' },
                { icon: Globe, title: 'Bilingual Support', description: 'English & Arabic translations', color: '#8b5cf6' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                    <CardContent className="p-6 text-center">
                      <div 
                        className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ background: `${feature.color}20` }}
                      >
                        <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/60 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-white/60">
                Everything you need to know about our subscription plans
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqItems.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card 
                    className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium pr-4">{faq.question}</h3>
                        {expandedFaq === idx ? (
                          <ChevronUp className="w-5 h-5 text-white/50 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/50 flex-shrink-0" />
                        )}
                      </div>
                      <AnimatePresence>
                        {expandedFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-white/60 mt-4 pt-4 border-t border-white/10">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card 
              className="overflow-hidden border-2"
              style={{
                borderColor: '#ffd70060',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(184,134,11,0.05))'
              }}
            >
              <CardContent className="p-8 md:p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <Sparkles className="w-12 h-12 mx-auto mb-6 text-yellow-400" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Master American English?
                  </h2>
                  <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of learners who have transformed their English skills
                    with Prize2Pride's stunning host couples and comprehensive curriculum.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="px-8 h-14 text-lg font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #ffd700, #b8860b)',
                        color: '#000'
                      }}
                      onClick={() => handleSubscribe('gold')}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Get Gold - Most Popular
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 h-14 text-lg font-semibold border-white/30 text-white hover:bg-white/10"
                      onClick={() => handleSubscribe('freemium')}
                    >
                      Start Free Trial
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-white/50 text-sm">
              Marketed by <span className="text-yellow-400">CodinCloud</span> — Turning Ideas into Sophisticated Platforms
            </p>
            <p className="text-white/30 text-xs mt-2">
              All payments are securely processed through Stripe. Prices are in USD.
            </p>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
