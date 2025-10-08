import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, AlertCircle } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

import { Id } from "@/convex/_generated/dataModel";

interface TaskCardProps {
  task: Doc<"tasks">;
  onToggle: (id: Id<"tasks">) => void;
  onEdit: (task: Doc<"tasks">) => void;
  onDelete: (id: Id<"tasks">) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status === "incomplete";
  
  const priorityColors = {
    low: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    high: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-[#111111] border-[#222222] hover:border-[#00ff88]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={() => onToggle(task._id)}
                className="mt-1 border-[#00ff88] data-[state=checked]:bg-[#00ff88] data-[state=checked]:text-black"
              />
              <div className="flex-1">
                <CardTitle className={`text-lg ${task.status === "completed" ? "line-through text-muted-foreground" : "text-white"}`}>
                  {task.title}
                </CardTitle>
                <CardDescription className="mt-1 text-gray-400">
                  {task.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="h-8 w-8 text-[#0088ff] hover:text-[#0088ff] hover:bg-[#0088ff]/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task._id)}
                className="h-8 w-8 text-[#ff0080] hover:text-[#ff0080] hover:bg-[#ff0080]/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className={priorityColors[task.priority]} variant="outline">
              {task.priority.toUpperCase()}
            </Badge>
            {task.deadline && (
              <Badge variant="outline" className={`${isOverdue ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-[#222222] text-gray-400 border-[#333333]"}`}>
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(task.deadline).toLocaleDateString()}
                {isOverdue && <AlertCircle className="h-3 w-3 ml-1" />}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
