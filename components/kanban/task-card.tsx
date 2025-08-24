"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, MessageSquare, Paperclip, AlertCircle, MoreHorizontal, Edit2, Trash2, Eye, Zap } from "lucide-react"
import { TaskDetailModal } from "./task-detail-modal"

interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high" | "urgent"
  assignees: Array<{
    id: string
    name: string
    avatar?: string
  }>
  dueDate?: string
  comments: number
  attachments: number
  labels: Array<{
    id: string
    name: string
    color: string
  }>
}

interface TaskCardProps {
  task: Task
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask?: (taskId: string) => void
}

export function TaskCard({ task, onUpdateTask, onDeleteTask }: TaskCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-gradient-to-br from-red-50/80 to-red-100/40 dark:from-red-950/20 dark:to-red-900/10"
      case "high":
        return "border-l-orange-500 bg-gradient-to-br from-orange-50/80 to-orange-100/40 dark:from-orange-950/20 dark:to-orange-900/10"
      case "medium":
        return "border-l-yellow-500 bg-gradient-to-br from-yellow-50/80 to-yellow-100/40 dark:from-yellow-950/20 dark:to-yellow-900/10"
      case "low":
        return "border-l-green-500 bg-gradient-to-br from-green-50/80 to-green-100/40 dark:from-green-950/20 dark:to-green-900/10"
      default:
        return "border-l-gray-500 bg-gradient-to-br from-gray-50/80 to-gray-100/40 dark:from-gray-950/20 dark:to-gray-900/10"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Zap className="h-3 w-3 text-red-500 animate-pulse" />
      case "high":
        return <AlertCircle className="h-3 w-3 text-orange-500" />
      default:
        return null
    }
  }

  const handleQuickEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDetailModal(true)
  }

  const handleQuickDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDeleteTask && confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(task.id)
    }
  }

  return (
    <>
      <Card
        className={`cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-l-4 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:scale-[1.02] group ${getPriorityColor(
          task.priority,
        )}`}
        onClick={() => setShowDetailModal(true)}
      >
        <CardContent className="p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Header with Actions */}
          <div className="flex items-start justify-between mb-2 relative z-10">
            <div className="flex-1">
              {/* Labels */}
              {task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {task.labels.slice(0, 2).map((label) => (
                    <Badge
                      key={label.id}
                      className={`text-xs text-white ${label.color} shadow-sm hover:shadow-md transition-shadow duration-200`}
                    >
                      {label.name}
                    </Badge>
                  ))}
                  {task.labels.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      +{task.labels.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="flex items-start space-x-2">
                <h4 className="font-medium text-sm text-foreground leading-tight flex-1 group-hover:text-primary transition-colors duration-200">
                  {task.title}
                </h4>
                {getPriorityIcon(task.priority)}
              </div>
            </div>

            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/20 hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="backdrop-blur-sm bg-background/95">
                <DropdownMenuItem onClick={handleQuickEdit} className="hover:bg-primary/10">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleQuickEdit} className="hover:bg-primary/10">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleQuickDelete} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 relative z-10">{task.description}</p>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground mb-3 relative z-10">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{task.dueDate}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between relative z-10">
            {/* Assignees */}
            <div className="flex -space-x-1">
              {task.assignees.slice(0, 3).map((assignee, index) => (
                <Avatar
                  key={assignee.id}
                  className="h-6 w-6 border-2 border-background hover:scale-110 transition-transform duration-200 shadow-sm"
                  style={{ zIndex: task.assignees.length - index }}
                >
                  <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20">
                    {assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-muted to-primary/20 border-2 border-background flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200">
                  <span className="text-xs font-medium">+{task.assignees.length - 3}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-2">
              {task.comments > 0 && (
                <div className="flex items-center text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-colors duration-200">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {task.comments}
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded-full hover:bg-accent/20 transition-colors duration-200">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {task.attachments}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={task}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onUpdateTask={onUpdateTask || (() => {})}
        onDeleteTask={onDeleteTask || (() => {})}
      />
    </>
  )
}
