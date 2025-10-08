import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all tasks for a user by Firebase UID
export const getUserTasks = query({
  args: {
    firebaseUid: v.string(),
    filter: v.optional(v.union(v.literal("all"), v.literal("completed"), v.literal("incomplete"))),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get user by Firebase UID
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .unique();

    if (!user) {
      return [];
    }

    let tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Apply status filter
    if (args.filter === "completed") {
      tasks = tasks.filter((task) => task.status === "completed");
    } else if (args.filter === "incomplete") {
      tasks = tasks.filter((task) => task.status === "incomplete");
    }

    // Apply search filter
    if (args.searchQuery && args.searchQuery.trim() !== "") {
      const query = args.searchQuery.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Sort by creation time (newest first)
    return tasks.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Mutation to create a new task
export const createTask = mutation({
  args: {
    firebaseUid: v.string(),
    title: v.string(),
    description: v.string(),
    deadline: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    // Get user by Firebase UID
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (!args.title.trim()) {
      throw new Error("Title is required");
    }

    if (!args.description.trim()) {
      throw new Error("Description is required");
    }

    const taskId = await ctx.db.insert("tasks", {
      userId: user._id,
      title: args.title.trim(),
      description: args.description.trim(),
      deadline: args.deadline,
      priority: args.priority || "medium",
      status: "incomplete",
    });

    return taskId;
  },
});

// Mutation to update a task
export const updateTask = mutation({
  args: {
    firebaseUid: v.string(),
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    deadline: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    status: v.optional(v.union(v.literal("completed"), v.literal("incomplete"))),
  },
  handler: async (ctx, args) => {
    // Get user by Firebase UID
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== user._id) {
      throw new Error("Not authorized to update this task");
    }

    const updates: any = {};
    if (args.title !== undefined) {
      if (!args.title.trim()) {
        throw new Error("Title cannot be empty");
      }
      updates.title = args.title.trim();
    }
    if (args.description !== undefined) {
      if (!args.description.trim()) {
        throw new Error("Description cannot be empty");
      }
      updates.description = args.description.trim();
    }
    if (args.deadline !== undefined) updates.deadline = args.deadline;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Mutation to delete a task
export const deleteTask = mutation({
  args: {
    firebaseUid: v.string(),
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // Get user by Firebase UID
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== user._id) {
      throw new Error("Not authorized to delete this task");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Mutation to toggle task status
export const toggleTaskStatus = mutation({
  args: {
    firebaseUid: v.string(),
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // Get user by Firebase UID
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== user._id) {
      throw new Error("Not authorized to update this task");
    }

    const newStatus = task.status === "completed" ? "incomplete" : "completed";
    await ctx.db.patch(args.id, { status: newStatus });
    return args.id;
  },
});