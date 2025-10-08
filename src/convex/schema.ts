import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    // Users table adapted for Firebase Auth
    users: defineTable({
      firebaseUid: v.string(), // Firebase user ID
      email: v.string(),
      name: v.optional(v.string()),
      photoURL: v.optional(v.string()),
    })
      .index("by_firebase_uid", ["firebaseUid"])
      .index("by_email", ["email"]),

    // Tasks table (unchanged structure, still references users)
    tasks: defineTable({
      userId: v.id("users"),
      title: v.string(),
      description: v.string(),
      deadline: v.optional(v.string()),
      priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      status: v.union(v.literal("completed"), v.literal("incomplete")),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_status", ["userId", "status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;