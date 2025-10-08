import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog, TaskFormData } from "@/components/TaskDialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Plus, Search, LogOut, Loader2, CheckCircle2, Circle, ListTodo } from "lucide-react";
import { toast } from "sonner";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Doc<"tasks"> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Id<"tasks"> | null>(null);

  const tasks = useQuery(api.tasks.getUserTasks, { filter, searchQuery });
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const toggleTaskStatus = useMutation(api.tasks.toggleTaskStatus);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTask({
        title: data.title,
        description: data.description,
        deadline: data.deadline || undefined,
        priority: data.priority,
      });
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create task");
      throw error;
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      await updateTask({
        id: editingTask._id,
        title: data.title,
        description: data.description,
        deadline: data.deadline || undefined,
        priority: data.priority,
      });
      toast.success("Task updated successfully!");
      setEditingTask(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
      throw error;
    }
  };

  const handleToggleTask = async (id: Id<"tasks">) => {
    try {
      await toggleTaskStatus({ id });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask({ id: taskToDelete });
      toast.success("Task deleted successfully!");
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  const completedCount = tasks?.filter((t) => t.status === "completed").length || 0;
  const totalCount = tasks?.length || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="border-b border-[#222222] bg-[#111111]/80 backdrop-blur-lg sticky top-0 z-50 shadow-[0_0_30px_rgba(0,255,136,0.1)]"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#0088ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.5)]">
                <ListTodo className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Task Manager</h1>
                <p className="text-sm text-gray-400">Welcome back, {user?.name || user?.email || "User"}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-transparent border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080]/10 hover:text-[#ff0080]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 shadow-[0_0_20px_rgba(0,136,255,0.1)]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#0088ff]/20 flex items-center justify-center">
                <ListTodo className="h-6 w-6 text-[#0088ff]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-white">{totalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#00ff88]/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-white">{completedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-6 shadow-[0_0_20px_rgba(255,0,128,0.1)]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#ff0080]/20 flex items-center justify-center">
                <Circle className="h-6 w-6 text-[#ff0080]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Incomplete</p>
                <p className="text-3xl font-bold text-white">{totalCount - completedCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#111111] border-[#333333] text-white placeholder:text-gray-600 focus:border-[#00ff88] focus:ring-[#00ff88]/20"
            />
          </div>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-full md:w-[200px] bg-[#111111] border-[#333333] text-white focus:border-[#00ff88] focus:ring-[#00ff88]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#222222] text-white">
              <SelectItem value="all" className="focus:bg-[#0088ff]/20 focus:text-[#0088ff]">All Tasks</SelectItem>
              <SelectItem value="completed" className="focus:bg-[#00ff88]/20 focus:text-[#00ff88]">Completed</SelectItem>
              <SelectItem value="incomplete" className="focus:bg-[#ff0080]/20 focus:text-[#ff0080]">Incomplete</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setEditingTask(null);
              setDialogOpen(true);
            }}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_20px_rgba(0,255,136,0.3)] font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {tasks === undefined ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#111111] border border-[#222222] mb-4">
                <ListTodo className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating your first task"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setDialogOpen(true);
                  }}
                  className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Task
                </Button>
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={(task) => {
                  setEditingTask(task);
                  setDialogOpen(true);
                }}
                onDelete={(id) => {
                  setTaskToDelete(id as Id<"tasks">);
                  setDeleteDialogOpen(true);
                }}
              />
            ))
          )}
        </motion.div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#111111] border-[#222222] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ff0080]">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#333333] text-white hover:bg-[#222222] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-[#ff0080] text-white hover:bg-[#ff0080]/90 shadow-[0_0_20px_rgba(255,0,128,0.3)]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
