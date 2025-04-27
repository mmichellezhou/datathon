import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { difficultyOptions } from "@/lib/petData";
import { DifficultyLevel } from "@/contexts/AppContext";
import { Book, Clock, Square, Pencil, FileText } from "lucide-react";

interface TaskFormData {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  timeSpent: number;
}

const TaskForm: React.FC = () => {
  const { addTask, lastSelectedDifficulty } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      timeSpent: 15,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    
    // Simulate a slight delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addTask({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      timeSpent: Number(data.timeSpent),
    });
    
    // Reset the form but keep the same values
    form.reset({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      timeSpent: data.timeSpent,
    });
    
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Completed Task</CardTitle>
        <CardDescription>
          Track your productivity and make your pet happy!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 min-h-[200px] flex flex-col justify-between">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Task title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="What did you accomplish?" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Add more details about your task..." {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeSpent"
                rules={{
                  required: "Time spent is required",
                  min: {
                    value: 1,
                    message: "Minimum time is 1 minute",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (minutes)</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="1"
                          placeholder="Time in minutes"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging..." : "Log Task"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
