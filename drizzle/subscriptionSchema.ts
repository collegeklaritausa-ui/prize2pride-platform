import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
  mysqlEnum,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/**
 * Subscription Tiers - 6 Pack System
 * Freemium → Bronze → Silver → Gold → Diamond → VIP Millionaire
 */
export const subscriptionTiers = mysqlTable("subscription_tiers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  description: text("description").notNull(),
  monthlyPrice: int("monthlyPrice").default(0).notNull(), // in cents
  yearlyPrice: int("yearlyPrice").default(0).notNull(), // in cents
  color: varchar("color", { length: 64 }).notNull(), // hex color for UI
  icon: varchar("icon", { length: 64 }).notNull(), // icon identifier
  badgeUrl: text("badgeUrl"), // badge image URL
  order: int("order").default(0).notNull(), // display order
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubscriptionTier = typeof subscriptionTiers.$inferSelect;
export type InsertSubscriptionTier = typeof subscriptionTiers.$inferInsert;

/**
 * Subscription Features - What each tier includes
 */
export const subscriptionFeatures = mysqlTable("subscription_features", {
  id: int("id").autoincrement().primaryKey(),
  tierId: varchar("tierId", { length: 64 }).notNull(),
  featureName: varchar("featureName", { length: 255 }).notNull(),
  featureKey: varchar("featureKey", { length: 128 }).notNull(), // programmatic key
  description: text("description"),
  limitValue: int("limitValue"), // null = unlimited
  isUnlimited: boolean("isUnlimited").default(false).notNull(),
  isEnabled: boolean("isEnabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  tierIdIdx: index("subscription_features_tierId_idx").on(table.tierId),
}));

export type SubscriptionFeature = typeof subscriptionFeatures.$inferSelect;
export type InsertSubscriptionFeature = typeof subscriptionFeatures.$inferInsert;

/**
 * User Subscriptions - Track user subscription status
 */
export const userSubscriptions = mysqlTable("user_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tierId: varchar("tierId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired", "trial", "pending"]).default("active").notNull(),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "yearly", "lifetime"]).default("monthly").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  trialEndDate: timestamp("trialEndDate"),
  cancelledAt: timestamp("cancelledAt"),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  metadata: json("metadata"), // additional subscription data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("user_subscriptions_userId_idx").on(table.userId),
  tierIdIdx: index("user_subscriptions_tierId_idx").on(table.tierId),
  statusIdx: index("user_subscriptions_status_idx").on(table.status),
  userTierIdx: uniqueIndex("user_subscriptions_user_tier_idx").on(table.userId),
}));

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Subscription Usage Tracking
 */
export const subscriptionUsage = mysqlTable("subscription_usage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  featureKey: varchar("featureKey", { length: 128 }).notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("subscription_usage_userId_idx").on(table.userId),
  featureKeyIdx: index("subscription_usage_featureKey_idx").on(table.featureKey),
  userFeaturePeriodIdx: uniqueIndex("subscription_usage_user_feature_period_idx").on(
    table.userId, 
    table.featureKey, 
    table.periodStart
  ),
}));

export type SubscriptionUsage = typeof subscriptionUsage.$inferSelect;
export type InsertSubscriptionUsage = typeof subscriptionUsage.$inferInsert;

// Default tier data for seeding
export const DEFAULT_SUBSCRIPTION_TIERS = [
  {
    id: "freemium",
    name: "freemium",
    displayName: "Freemium",
    description: "Start your English learning journey for free. Access basic lessons and vocabulary.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "#6B7280",
    icon: "gift",
    order: 1,
  },
  {
    id: "bronze",
    name: "bronze",
    displayName: "Bronze",
    description: "Unlock more lessons and practice with AI avatars. Perfect for casual learners.",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    color: "#CD7F32",
    icon: "medal",
    order: 2,
  },
  {
    id: "silver",
    name: "silver",
    displayName: "Silver",
    description: "Full access to all lessons with advanced conversation practice and progress tracking.",
    monthlyPrice: 1999,
    yearlyPrice: 19990,
    color: "#C0C0C0",
    icon: "award",
    order: 3,
  },
  {
    id: "gold",
    name: "gold",
    displayName: "Gold",
    description: "Premium experience with unlimited AI conversations, personalized learning paths, and certificates.",
    monthlyPrice: 3999,
    yearlyPrice: 39990,
    color: "#FFD700",
    icon: "crown",
    order: 4,
  },
  {
    id: "diamond",
    name: "diamond",
    displayName: "Diamond",
    description: "Elite tier with 1-on-1 AI tutoring sessions, priority support, and exclusive content.",
    monthlyPrice: 7999,
    yearlyPrice: 79990,
    color: "#B9F2FF",
    icon: "gem",
    order: 5,
  },
  {
    id: "vip-millionaire",
    name: "vip-millionaire",
    displayName: "VIP Millionaire",
    description: "The ultimate package. Lifetime access, all features unlocked, personal success manager, and exclusive community.",
    monthlyPrice: 19999,
    yearlyPrice: 149990,
    color: "#8B5CF6",
    icon: "sparkles",
    order: 6,
  },
];

// Feature limits per tier
export const TIER_FEATURES = {
  freemium: {
    dailyLessons: 3,
    dailyConversations: 2,
    vocabularyCards: 50,
    aiImageGeneration: 0,
    textToSpeech: 10,
    certificates: false,
    prioritySupport: false,
    personalizedPath: false,
    offlineAccess: false,
    adFree: false,
  },
  bronze: {
    dailyLessons: 10,
    dailyConversations: 10,
    vocabularyCards: 200,
    aiImageGeneration: 5,
    textToSpeech: 50,
    certificates: false,
    prioritySupport: false,
    personalizedPath: false,
    offlineAccess: false,
    adFree: true,
  },
  silver: {
    dailyLessons: 30,
    dailyConversations: 30,
    vocabularyCards: 500,
    aiImageGeneration: 20,
    textToSpeech: 100,
    certificates: true,
    prioritySupport: false,
    personalizedPath: false,
    offlineAccess: true,
    adFree: true,
  },
  gold: {
    dailyLessons: -1, // unlimited
    dailyConversations: -1,
    vocabularyCards: -1,
    aiImageGeneration: 50,
    textToSpeech: -1,
    certificates: true,
    prioritySupport: false,
    personalizedPath: true,
    offlineAccess: true,
    adFree: true,
  },
  diamond: {
    dailyLessons: -1,
    dailyConversations: -1,
    vocabularyCards: -1,
    aiImageGeneration: -1,
    textToSpeech: -1,
    certificates: true,
    prioritySupport: true,
    personalizedPath: true,
    offlineAccess: true,
    adFree: true,
    oneOnOneTutoring: true,
  },
  "vip-millionaire": {
    dailyLessons: -1,
    dailyConversations: -1,
    vocabularyCards: -1,
    aiImageGeneration: -1,
    textToSpeech: -1,
    certificates: true,
    prioritySupport: true,
    personalizedPath: true,
    offlineAccess: true,
    adFree: true,
    oneOnOneTutoring: true,
    lifetimeAccess: true,
    exclusiveCommunity: true,
    personalSuccessManager: true,
  },
};
