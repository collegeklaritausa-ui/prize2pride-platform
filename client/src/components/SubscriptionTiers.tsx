import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Gift,
  Medal,
  Award,
  Crown,
  Gem,
  Sparkles,
  Check,
  X,
  Zap,
  Star,
  Infinity,
} from "lucide-react";

const tiers = [
  {
    id: "freemium",
    name: "Freemium",
    description: "Start your English learning journey for free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "from-gray-400 to-gray-600",
    borderColor: "border-gray-300",
    icon: Gift,
    popular: false,
    features: [
      { name: "3 lessons per day", included: true },
      { name: "2 AI conversations daily", included: true },
      { name: "50 vocabulary cards", included: true },
      { name: "Basic progress tracking", included: true },
      { name: "AI image generation", included: false },
      { name: "Certificates", included: false },
      { name: "Offline access", included: false },
      { name: "Ad-free experience", included: false },
    ],
  },
  {
    id: "bronze",
    name: "Bronze",
    description: "Perfect for casual learners",
    monthlyPrice: 9.99,
    yearlyPrice: 99.90,
    color: "from-amber-600 to-amber-800",
    borderColor: "border-amber-500",
    icon: Medal,
    popular: false,
    features: [
      { name: "10 lessons per day", included: true },
      { name: "10 AI conversations daily", included: true },
      { name: "200 vocabulary cards", included: true },
      { name: "Advanced progress tracking", included: true },
      { name: "5 AI images per day", included: true },
      { name: "Certificates", included: false },
      { name: "Offline access", included: false },
      { name: "Ad-free experience", included: true },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    description: "Full access for serious learners",
    monthlyPrice: 19.99,
    yearlyPrice: 199.90,
    color: "from-slate-300 to-slate-500",
    borderColor: "border-slate-400",
    icon: Award,
    popular: false,
    features: [
      { name: "30 lessons per day", included: true },
      { name: "30 AI conversations daily", included: true },
      { name: "500 vocabulary cards", included: true },
      { name: "Full progress analytics", included: true },
      { name: "20 AI images per day", included: true },
      { name: "Certificates", included: true },
      { name: "Offline access", included: true },
      { name: "Ad-free experience", included: true },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    description: "Premium experience with unlimited access",
    monthlyPrice: 39.99,
    yearlyPrice: 399.90,
    color: "from-yellow-400 to-yellow-600",
    borderColor: "border-yellow-500",
    icon: Crown,
    popular: true,
    features: [
      { name: "Unlimited lessons", included: true, unlimited: true },
      { name: "Unlimited AI conversations", included: true, unlimited: true },
      { name: "Unlimited vocabulary cards", included: true, unlimited: true },
      { name: "Personalized learning path", included: true },
      { name: "50 AI images per day", included: true },
      { name: "Premium certificates", included: true },
      { name: "Offline access", included: true },
      { name: "Ad-free experience", included: true },
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    description: "Elite tier with exclusive features",
    monthlyPrice: 79.99,
    yearlyPrice: 799.90,
    color: "from-cyan-300 to-blue-500",
    borderColor: "border-cyan-400",
    icon: Gem,
    popular: false,
    features: [
      { name: "Everything in Gold", included: true },
      { name: "Unlimited AI images", included: true, unlimited: true },
      { name: "1-on-1 AI tutoring sessions", included: true },
      { name: "Priority support 24/7", included: true },
      { name: "Exclusive content library", included: true },
      { name: "Early access to features", included: true },
      { name: "Custom learning reports", included: true },
      { name: "Business English module", included: true },
    ],
  },
  {
    id: "vip-millionaire",
    name: "VIP Millionaire",
    description: "The ultimate lifetime package",
    monthlyPrice: 199.99,
    yearlyPrice: 1499.90,
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500",
    icon: Sparkles,
    popular: false,
    lifetime: true,
    features: [
      { name: "Everything in Diamond", included: true },
      { name: "Lifetime access", included: true, special: true },
      { name: "Personal success manager", included: true },
      { name: "Exclusive VIP community", included: true },
      { name: "White-glove onboarding", included: true },
      { name: "Custom curriculum design", included: true },
      { name: "Quarterly progress reviews", included: true },
      { name: "Founding member badge", included: true },
    ],
  },
];

export function SubscriptionTiers() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Pricing Plans
          </Badge>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Choose Your{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            From free access to VIP treatment, find the perfect plan for your English mastery goals.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label
              htmlFor="billing-toggle"
              className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label
              htmlFor="billing-toggle"
              className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs">
                Save 17%
              </Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={tier.popular ? "lg:scale-105 lg:z-10" : ""}
            >
              <Card
                className={`relative h-full flex flex-col overflow-hidden ${
                  tier.popular
                    ? "border-2 border-yellow-500 shadow-xl shadow-yellow-500/20"
                    : `border ${tier.borderColor}`
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    <Star className="w-3 h-3 inline mr-1" />
                    MOST POPULAR
                  </div>
                )}

                {tier.lifetime && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-br-lg">
                    <Infinity className="w-3 h-3 inline mr-1" />
                    LIFETIME
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}
                  >
                    <tier.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        ${isYearly ? (tier.yearlyPrice / 12).toFixed(2) : tier.monthlyPrice.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {isYearly && tier.yearlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${tier.yearlyPrice.toFixed(2)} billed yearly
                      </p>
                    )}
                    {tier.monthlyPrice === 0 && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Free forever
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground line-through"
                          } ${feature.special ? "font-semibold text-purple-600" : ""}`}
                        >
                          {feature.name}
                          {feature.unlimited && (
                            <Infinity className="w-3 h-3 inline ml-1 text-primary" />
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    className={`w-full h-12 text-base font-semibold ${
                      tier.popular
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                        : tier.id === "vip-millionaire"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        : ""
                    }`}
                    variant={tier.popular || tier.id === "vip-millionaire" ? "default" : "outline"}
                  >
                    {tier.monthlyPrice === 0 ? "Get Started Free" : `Choose ${tier.name}`}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by learners worldwide
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Secure payment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SubscriptionTiers;
