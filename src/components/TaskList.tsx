import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, Check, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TaskList: React.FC = () => {
  const { tasks } = useAppContext();

  // Sort tasks by completedAt (most recent first)
  const sortedTasks = [...tasks].sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks completed yet. Start logging your productivity!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="task-card border rounded-lg p-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary bg-opacity-10 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.timeSpent} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Pencil className="h-3 w-3" />
                          <Badge variant="outline" className={getDifficultyColor(task.difficulty)}>
                            {task.difficulty}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </div>
                  <time
                    dateTime={task.completedAt.toISOString()}
                    className="text-xs text-muted-foreground"
                  >
                    {format(task.completedAt, "MMM d, h:mm a")}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
