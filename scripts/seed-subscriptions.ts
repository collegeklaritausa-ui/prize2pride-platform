/**
 * Seed Subscription Packages for Prize2Pride Platform
 * 
 * Run with: npx tsx scripts/seed-subscriptions.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import { subscriptionPackages } from "../drizzle/schema";

const packages = [
  {
    name: 'freemium',
    displayName: 'Free Starter',
    tier: 'freemium' as const,
    priceMonthly: '0.00',
    priceYearly: '0.00',
    dailyLimitMinutes: 60,
    features: JSON.stringify([
      '1 Hour Daily Learning',
      'Access to A1 Lessons',
      'Basic Vocabulary',
      'Community Forum Access',
      'TTS Audio (Limited)',
    ]),
    description: 'Perfect for trying out the platform',
    badgeColor: '#6b7280',
    iconName: 'Gift',
    isPopular: false,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'bronze',
    displayName: 'Bronze Learner',
    tier: 'bronze' as const,
    priceMonthly: '5.00',
    priceYearly: '50.00',
    dailyLimitMinutes: 480,
    features: JSON.stringify([
      '8 Hours Daily Learning',
      'Access to A1-A2 Lessons',
      'Extended Vocabulary',
      'Community Forum Access',
      'TTS Audio (Full)',
      'Progress Tracking',
    ]),
    description: 'Great for casual learners',
    badgeColor: '#cd7f32',
    iconName: 'Shield',
    isPopular: false,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'silver',
    displayName: 'Silver Scholar',
    tier: 'silver' as const,
    priceMonthly: '10.00',
    priceYearly: '100.00',
    dailyLimitMinutes: 960,
    features: JSON.stringify([
      '16 Hours Daily Learning',
      'Access to A1-B1 Lessons',
      'Full Vocabulary Library',
      'Community Forum Access',
      'TTS Audio (HD Quality)',
      'Progress Tracking',
      'AI Conversation Practice',
    ]),
    description: 'Ideal for dedicated students',
    badgeColor: '#c0c0c0',
    iconName: 'Star',
    isPopular: false,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'gold',
    displayName: 'Gold Master',
    tier: 'gold' as const,
    priceMonthly: '50.00',
    priceYearly: '500.00',
    dailyLimitMinutes: -1, // Unlimited
    features: JSON.stringify([
      'Unlimited Daily Learning',
      'Access to A1-B2 Lessons',
      'Full Vocabulary Library',
      'VIP Forum Access',
      'TTS Audio (HD Quality)',
      'Advanced Progress Analytics',
      'AI Conversation Practice',
      'Premium Host Couples',
      'Certificates',
    ]),
    description: 'For serious language enthusiasts',
    badgeColor: '#ffd700',
    iconName: 'Crown',
    isPopular: true,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: 'diamond',
    displayName: 'Diamond Elite',
    tier: 'diamond' as const,
    priceMonthly: '50.00',
    priceYearly: '500.00',
    dailyLimitMinutes: -1, // Unlimited
    features: JSON.stringify([
      'Unlimited Daily Learning',
      'Access to ALL Lessons (A1-C2)',
      'Full Vocabulary + Idioms',
      'VIP Forum + Live Events',
      'TTS Audio (Ultra HD)',
      'Advanced Progress Analytics',
      'Unlimited AI Conversations',
      'All 64 Host Couples',
      'Premium Certificates',
      'Extended Tutoring Sessions',
    ]),
    description: 'Premium features for excellence',
    badgeColor: '#b9f2ff',
    iconName: 'Diamond',
    isPopular: false,
    isActive: true,
    sortOrder: 5,
  },
  {
    name: 'vip_millionaire',
    displayName: 'VIP Millionaire',
    tier: 'vip_millionaire' as const,
    priceMonthly: '100.00',
    priceYearly: '1000.00',
    dailyLimitMinutes: -1, // Unlimited
    features: JSON.stringify([
      'Unlimited Everything',
      'All Lessons + Exclusive Content',
      'Complete Learning Library',
      'Private VIP Community',
      'TTS Audio (Studio Quality)',
      'Personal Learning Dashboard',
      'Unlimited AI + Live Tutoring',
      'All 64 Host Couples + Tunisian',
      'Gold-Embossed Certificates',
      '24/7 Priority Support',
    ]),
    description: 'The ultimate learning experience',
    badgeColor: '#ff00ff',
    iconName: 'Sparkles',
    isPopular: false,
    isActive: true,
    sortOrder: 6,
  },
];

async function seedSubscriptions() {
  console.log('🌱 Seeding subscription packages...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }

  try {
    const db = drizzle(process.env.DATABASE_URL);
    
    for (const pkg of packages) {
      console.log(`  📦 Adding ${pkg.displayName}...`);
      await db.insert(subscriptionPackages).values(pkg).onDuplicateKeyUpdate({
        set: {
          displayName: pkg.displayName,
          priceMonthly: pkg.priceMonthly,
          priceYearly: pkg.priceYearly,
          dailyLimitMinutes: pkg.dailyLimitMinutes,
          features: pkg.features,
          description: pkg.description,
          badgeColor: pkg.badgeColor,
          iconName: pkg.iconName,
          isPopular: pkg.isPopular,
          sortOrder: pkg.sortOrder,
        }
      });
    }

    console.log('✅ Subscription packages seeded successfully!');
    console.log(`   Total packages: ${packages.length}`);
    console.log('   - Freemium: $0 (1 hour/day)');
    console.log('   - Bronze: $5/month (8 hours/day)');
    console.log('   - Silver: $10/month (16 hours/day)');
    console.log('   - Gold: $50/month (Unlimited)');
    console.log('   - Diamond: $50/month (Unlimited)');
    console.log('   - VIP Millionaire: $100/month (Unlimited)');
    
  } catch (error) {
    console.error('❌ Error seeding subscriptions:', error);
    process.exit(1);
  }
}

seedSubscriptions();
