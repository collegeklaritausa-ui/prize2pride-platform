/**
 * Subscription Router - Prize2Pride Platform
 * 
 * Handles subscription management, usage tracking, and Stripe integration
 * 
 * Subscription Tiers:
 * - Freemium: Free (60 min/day)
 * - Bronze: $5/month (480 min/day)
 * - Silver: $10/month (960 min/day)
 * - Gold: $50/month (Unlimited)
 * - Diamond: $50/month (Unlimited)
 * - VIP Millionaire: $100/month (Unlimited)
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";

// Subscription tier type
type SubscriptionTier = 'freemium' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'vip_millionaire';

// Subscription tier configurations
const tierConfigs: Record<SubscriptionTier, {
  dailyLimitMinutes: number;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}> = {
  freemium: {
    dailyLimitMinutes: 60,
    priceMonthly: 0,
    priceYearly: 0,
    features: ['1 Hour Daily', 'A1 Lessons', 'Basic Vocabulary', 'Community Forum']
  },
  bronze: {
    dailyLimitMinutes: 480,
    priceMonthly: 5,
    priceYearly: 50,
    features: ['8 Hours Daily', 'A1-A2 Lessons', 'Extended Vocabulary', 'Progress Tracking']
  },
  silver: {
    dailyLimitMinutes: 960,
    priceMonthly: 10,
    priceYearly: 100,
    features: ['16 Hours Daily', 'A1-B1 Lessons', 'Full Vocabulary', 'AI Conversations']
  },
  gold: {
    dailyLimitMinutes: -1,
    priceMonthly: 50,
    priceYearly: 500,
    features: ['Unlimited', 'A1-B2 Lessons', 'Premium Hosts', 'Certificates']
  },
  diamond: {
    dailyLimitMinutes: -1,
    priceMonthly: 50,
    priceYearly: 500,
    features: ['Unlimited', 'All Lessons', 'All 64 Hosts', 'Extended Tutoring']
  },
  vip_millionaire: {
    dailyLimitMinutes: -1,
    priceMonthly: 100,
    priceYearly: 1000,
    features: ['Unlimited Everything', 'Exclusive Content', '24/7 Support', 'Gold Certificates']
  }
};

// Tier order for comparison
const tierOrder: SubscriptionTier[] = ['freemium', 'bronze', 'silver', 'gold', 'diamond', 'vip_millionaire'];

export const subscriptionRouter = router({
  /**
   * Get all subscription packages
   */
  getPackages: publicProcedure.query(async () => {
    return Object.entries(tierConfigs).map(([tier, config]) => ({
      tier,
      ...config,
      isUnlimited: config.dailyLimitMinutes === -1
    }));
  }),

  /**
   * Get current user's subscription status
   */
  getMySubscription: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const user = await db.select().from(users).where(eq(users.openId, ctx.user.openId)).limit(1);
    
    if (!user.length) {
      return {
        tier: 'freemium' as SubscriptionTier,
        status: 'active',
        dailyLimitMinutes: 60,
        usedMinutesToday: 0,
        remainingMinutes: 60,
        isUnlimited: false
      };
    }

    const currentUser = user[0];
    const userTier = (currentUser.subscriptionTier || 'freemium') as SubscriptionTier;
    const tierConfig = tierConfigs[userTier] || tierConfigs.freemium;
    
    // Check if we need to reset daily usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = currentUser.lastUsageResetDate ? new Date(currentUser.lastUsageResetDate) : null;
    
    let usedMinutesToday = currentUser.dailyUsageMinutes || 0;
    
    if (!lastReset || lastReset < today) {
      // Reset daily usage
      await db.update(users)
        .set({ 
          dailyUsageMinutes: 0, 
          lastUsageResetDate: today 
        })
        .where(eq(users.id, currentUser.id));
      usedMinutesToday = 0;
    }

    const isUnlimited = tierConfig.dailyLimitMinutes === -1;
    const remainingMinutes = isUnlimited ? -1 : Math.max(0, tierConfig.dailyLimitMinutes - usedMinutesToday);

    return {
      tier: userTier,
      status: currentUser.subscriptionStatus || 'active',
      dailyLimitMinutes: tierConfig.dailyLimitMinutes,
      usedMinutesToday,
      remainingMinutes,
      isUnlimited,
      subscriptionStartDate: currentUser.subscriptionStartDate,
      subscriptionEndDate: currentUser.subscriptionEndDate,
      features: tierConfig.features
    };
  }),

  /**
   * Check if user can access content based on subscription
   */
  checkAccess: protectedProcedure
    .input(z.object({
      requiredTier: z.enum(['freemium', 'bronze', 'silver', 'gold', 'diamond', 'vip_millionaire']).optional(),
      durationMinutes: z.number().min(1).optional()
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const user = await db.select().from(users).where(eq(users.openId, ctx.user.openId)).limit(1);
      
      if (!user.length) {
        return { 
          canAccess: input.requiredTier === 'freemium' || !input.requiredTier,
          reason: 'User not found'
        };
      }

      const currentUser = user[0];
      const userTier = (currentUser.subscriptionTier || 'freemium') as SubscriptionTier;
      const tierConfig = tierConfigs[userTier] || tierConfigs.freemium;
      
      // Check tier access
      if (input.requiredTier) {
        const userTierIndex = tierOrder.indexOf(userTier);
        const requiredTierIndex = tierOrder.indexOf(input.requiredTier);
        
        if (userTierIndex < requiredTierIndex) {
          return {
            canAccess: false,
            reason: `This content requires ${input.requiredTier} subscription or higher`,
            requiredTier: input.requiredTier,
            currentTier: userTier
          };
        }
      }

      // Check daily usage limit
      if (tierConfig.dailyLimitMinutes !== -1) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastReset = currentUser.lastUsageResetDate ? new Date(currentUser.lastUsageResetDate) : null;
        
        let usedMinutesToday = currentUser.dailyUsageMinutes || 0;
        if (!lastReset || lastReset < today) {
          usedMinutesToday = 0;
        }

        const requestedDuration = input.durationMinutes || 0;
        if (usedMinutesToday + requestedDuration > tierConfig.dailyLimitMinutes) {
          return {
            canAccess: false,
            reason: `Daily limit reached. You have ${Math.max(0, tierConfig.dailyLimitMinutes - usedMinutesToday)} minutes remaining today.`,
            remainingMinutes: Math.max(0, tierConfig.dailyLimitMinutes - usedMinutesToday),
            dailyLimit: tierConfig.dailyLimitMinutes
          };
        }
      }

      return { canAccess: true };
    }),

  /**
   * Log usage time
   */
  logUsage: protectedProcedure
    .input(z.object({
      sessionType: z.enum(['lesson', 'chat', 'practice', 'vocabulary']),
      durationMinutes: z.number().min(1).max(480),
      lessonId: z.number().optional(),
      metadata: z.record(z.any()).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const user = await db.select().from(users).where(eq(users.openId, ctx.user.openId)).limit(1);
      if (!user.length) throw new Error("User not found");

      const currentUser = user[0];
      const userTier = (currentUser.subscriptionTier || 'freemium') as SubscriptionTier;
      const tierConfig = tierConfigs[userTier] || tierConfigs.freemium;

      // Check if within limit (for non-unlimited tiers)
      if (tierConfig.dailyLimitMinutes !== -1) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastReset = currentUser.lastUsageResetDate ? new Date(currentUser.lastUsageResetDate) : null;
        
        let usedMinutesToday = currentUser.dailyUsageMinutes || 0;
        if (!lastReset || lastReset < today) {
          usedMinutesToday = 0;
        }

        if (usedMinutesToday + input.durationMinutes > tierConfig.dailyLimitMinutes) {
          throw new Error(`Daily limit exceeded. You have ${Math.max(0, tierConfig.dailyLimitMinutes - usedMinutesToday)} minutes remaining.`);
        }
      }

      // Update user's daily usage
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReset = currentUser.lastUsageResetDate ? new Date(currentUser.lastUsageResetDate) : null;
      
      if (!lastReset || lastReset < today) {
        // Reset and add new usage
        await db.update(users)
          .set({ 
            dailyUsageMinutes: input.durationMinutes,
            lastUsageResetDate: today
          })
          .where(eq(users.id, currentUser.id));
      } else {
        // Add to existing usage
        await db.update(users)
          .set({ 
            dailyUsageMinutes: sql`${users.dailyUsageMinutes} + ${input.durationMinutes}`
          })
          .where(eq(users.id, currentUser.id));
      }

      return { success: true, minutesLogged: input.durationMinutes };
    }),

  /**
   * Upgrade subscription (Stripe integration placeholder)
   */
  upgradeSubscription: protectedProcedure
    .input(z.object({
      tier: z.enum(['bronze', 'silver', 'gold', 'diamond', 'vip_millionaire']),
      billingPeriod: z.enum(['monthly', 'yearly']).default('monthly')
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const user = await db.select().from(users).where(eq(users.openId, ctx.user.openId)).limit(1);
      if (!user.length) throw new Error("User not found");

      const tierConfig = tierConfigs[input.tier];
      if (!tierConfig) throw new Error("Invalid subscription tier");

      const price = input.billingPeriod === 'yearly' ? tierConfig.priceYearly : tierConfig.priceMonthly;

      // In production, this would:
      // 1. Create Stripe checkout session
      // 2. Return checkout URL
      // 3. Handle webhook for successful payment
      // 4. Update user subscription

      return {
        success: true,
        message: 'Stripe integration pending',
        tier: input.tier,
        price,
        billingPeriod: input.billingPeriod,
      };
    }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const user = await db.select().from(users).where(eq(users.openId, ctx.user.openId)).limit(1);
    if (!user.length) throw new Error("User not found");

    const userTier = (user[0].subscriptionTier || 'freemium') as SubscriptionTier;
    if (userTier === 'freemium') {
      throw new Error("Cannot cancel free subscription");
    }

    // In production, this would cancel the Stripe subscription
    await db.update(users)
      .set({ 
        subscriptionStatus: 'cancelled'
      })
      .where(eq(users.id, user[0].id));

    return { 
      success: true, 
      message: 'Subscription will be cancelled at the end of the billing period'
    };
  })
});
