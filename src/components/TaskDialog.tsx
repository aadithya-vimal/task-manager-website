import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  task?: Doc<"tasks"> | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  deadline?: string;
  priority: "low" | "medium" | "high";
}

export function TaskDialog({ open, onOpenChange, onSubmit, task }: TaskDialogProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        deadline: task.deadline || "",
        priority: task.priority,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        deadline: "",
        priority: "medium",
      });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111111] border-[#222222] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#00ff88]">
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {task ? "Update your task details below." : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-white">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                required
                className="bg-[#0a0a0a] border-[#333333] text-white placeholder:text-gray-600 focus:border-[#00ff88] focus:ring-[#00ff88]/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                required
                rows={4}
                className="bg-[#0a0a0a] border-[#333333] text-white placeholder:text-gray-600 focus:border-[#00ff88] focus:ring-[#00ff88]/20 resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline" className="text-white">
                Deadline (Optional)
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-[#0a0a0a] border-[#333333] text-white focus:border-[#00ff88] focus:ring-[#00ff88]/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority" className="text-white">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="bg-[#0a0a0a] border-[#333333] text-white focus:border-[#00ff88] focus:ring-[#00ff88]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-[#222222] text-white">
                  <SelectItem value="low" className="focus:bg-[#0088ff]/20 focus:text-[#0088ff]">Low</SelectItem>
                  <SelectItem value="medium" className="focus:bg-yellow-500/20 focus:text-yellow-400">Medium</SelectItem>
                  <SelectItem value="high" className="focus:bg-[#ff0080]/20 focus:text-[#ff0080]">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="bg-transparent border-[#333333] text-white hover:bg-[#222222] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {task ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{task ? "Update Task" : "Create Task"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
