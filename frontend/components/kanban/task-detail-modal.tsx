"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskComments } from "./task-comments"
import { UserAssignmentModal } from "@/components/team/user-assignment-modal"
import {
  CalendarIcon,
  Edit2,
  Save,
  X,
  Trash2,
  Plus,
  MessageSquare,
  Paperclip,
  User,
  Tag,
  Clock,
  AlertCircle,
  UserPlus,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt?: string
  replies: Comment[]
  likes: number
  isLiked: boolean
}

interface TaskDetailModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskDetailModal({ task, open, onOpenChange, onUpdateTask, onDeleteTask }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [newLabel, setNewLabel] = useState("")
  const [showAddLabel, setShowAddLabel] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  const [taskComments, setTaskComments] = useState<Comment[]>([
    {
      id: "comment-1",
      content: "I've started working on the wireframes. Should have the initial drafts ready by tomorrow.",
      author: {
        id: "1",
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-15T10:30:00Z",
      replies: [
        {
          id: "reply-1",
          content: "Great! Looking forward to seeing them. Make sure to include the mobile layouts too.",
          author: {
            id: "2",
            name: "Bob Smith",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          createdAt: "2024-01-15T11:15:00Z",
          replies: [],
          likes: 2,
          isLiked: false,
        },
      ],
      likes: 3,
      isLiked: true,
    },
    {
      id: "comment-2",
      content:
        "I've uploaded the brand guidelines to the shared folder. Please reference these for color schemes and typography.",
      author: {
        id: "3",
        name: "Carol Davis",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-14T14:20:00Z",
      replies: [],
      likes: 1,
      isLiked: false,
    },
  ])

  const handleAddComment = (taskId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      author: {
        id: "current-user",
        name: "Current User",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: new Date().toISOString(),
      replies: [],
      likes: 0,
      isLiked: false,
    }

    if (parentId) {
      // Add as reply
      setTaskComments(
        taskComments.map((comment) =>
          comment.id === parentId ? { ...comment, replies: [...comment.replies, newComment] } : comment,
        ),
      )
    } else {
      // Add as new comment
      setTaskComments([...taskComments, newComment])
    }

    // Update task comment count
    if (task) {
      onUpdateTask(task.id, { comments: task.comments + 1 })
    }
  }

  const handleUpdateComment = (commentId: string, content: string) => {
    const updateCommentInList = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, content, updatedAt: new Date().toISOString() }
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: updateCommentInList(comment.replies) }
        }
        return comment
      })
    }

    setTaskComments(updateCommentInList(taskComments))
  }

  const handleDeleteComment = (commentId: string) => {
    const deleteCommentFromList = (comments: Comment[]): Comment[] => {
      return comments
        .filter((comment) => comment.id !== commentId)
        .map((comment) => ({
          ...comment,
          replies: deleteCommentFromList(comment.replies),
        }))
    }

    setTaskComments(deleteCommentFromList(taskComments))

    // Update task comment count
    if (task) {
      onUpdateTask(task.id, { comments: Math.max(0, task.comments - 1) })
    }
  }

  const handleLikeComment = (commentId: string) => {
    const toggleLikeInList = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: toggleLikeInList(comment.replies) }
        }
        return comment
      })
    }

    setTaskComments(toggleLikeInList(taskComments))
  }

  const handleUpdateAssignees = (assignees: any[]) => {
    if (task) {
      onUpdateTask(task.id, { assignees })
    }
    if (isEditing && editedTask) {
      setEditedTask({ ...editedTask, assignees })
    }
  }

  if (!task) return null

  const handleEdit = () => {
    setEditedTask({ ...task })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedTask) {
      onUpdateTask(task.id, editedTask)
      setIsEditing(false)
      setEditedTask(null)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTask(null)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(task.id)
      onOpenChange(false)
    }
  }

  const handleAddLabel = () => {
    if (newLabel.trim() && editedTask) {
      const newLabelObj = {
        id: `label-${Date.now()}`,
        name: newLabel.trim(),
        color: "bg-blue-500",
      }
      setEditedTask({
        ...editedTask,
        labels: [...editedTask.labels, newLabelObj],
      })
      setNewLabel("")
      setShowAddLabel(false)
    }
  }

  const handleRemoveLabel = (labelId: string) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        labels: editedTask.labels.filter((label) => label.id !== labelId),
      })
    }
  }

  const currentTask = isEditing ? editedTask : task
  if (!currentTask) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent" || priority === "high") {
      return <AlertCircle className={`h-4 w-4 ${getPriorityColor(priority)}`} />
    }
    return <Clock className={`h-4 w-4 ${getPriorityColor(priority)}`} />
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getPriorityIcon(currentTask.priority)}
                <DialogTitle className="text-xl">
                  {isEditing ? (
                    <Input
                      value={editedTask?.title || ""}
                      onChange={(e) => setEditedTask(editedTask ? { ...editedTask, title: e.target.value } : null)}
                      className="text-xl font-semibold border-none p-0 h-auto"
                    />
                  ) : (
                    currentTask.title
                  )}
                </DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={handleEdit}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Task Details</TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Comments ({taskComments.reduce((total, comment) => total + 1 + comment.replies.length, 0)})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="flex-1 overflow-y-auto">
              <div className="space-y-6 pr-2">
                {/* Labels */}
                <div>
                  <Label className="text-sm font-medium flex items-center mb-2">
                    <Tag className="h-4 w-4 mr-1" />
                    Labels
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {currentTask.labels.map((label) => (
                      <Badge key={label.id} className={`text-white ${label.color} relative group`}>
                        {label.name}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveLabel(label.id)}
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        {showAddLabel ? (
                          <div className="flex items-center space-x-1">
                            <Input
                              placeholder="Label name"
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                              className="h-6 text-xs w-24"
                              onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
                            />
                            <Button size="sm" onClick={handleAddLabel} className="h-6 px-2">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAddLabel(true)}
                            className="h-6 px-2 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Label
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedTask?.description || ""}
                      onChange={(e) =>
                        setEditedTask(editedTask ? { ...editedTask, description: e.target.value } : null)
                      }
                      placeholder="Add a description..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {currentTask.description || "No description provided."}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Task Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Priority */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Priority</Label>
                    {isEditing ? (
                      <Select
                        value={editedTask?.priority}
                        onValueChange={(value: any) =>
                          setEditedTask(editedTask ? { ...editedTask, priority: value } : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(currentTask.priority)}
                        <span className={`text-sm font-medium capitalize ${getPriorityColor(currentTask.priority)}`}>
                          {currentTask.priority}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Due Date</Label>
                    {isEditing ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !editedTask?.dueDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editedTask?.dueDate ? format(new Date(editedTask.dueDate), "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editedTask?.dueDate ? new Date(editedTask.dueDate) : undefined}
                            onSelect={(date) =>
                              setEditedTask(
                                editedTask
                                  ? { ...editedTask, dueDate: date ? format(date, "yyyy-MM-dd") : undefined }
                                  : null,
                              )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{currentTask.dueDate || "No due date"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Enhanced Assignees Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Assignees ({currentTask.assignees.length})
                    </Label>
                    <Button size="sm" variant="outline" onClick={() => setShowAssignmentModal(true)} className="h-8">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentTask.assignees.map((assignee) => (
                      <div key={assignee.id} className="flex items-center space-x-2 bg-muted rounded-full px-3 py-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                          <AvatarFallback className="text-xs">
                            {assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => {
                              if (editedTask) {
                                setEditedTask({
                                  ...editedTask,
                                  assignees: editedTask.assignees.filter((a) => a.id !== assignee.id),
                                })
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {currentTask.assignees.length === 0 && (
                      <span className="text-sm text-muted-foreground">No assignees</span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Activity Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentTask.comments} comments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentTask.attachments} attachments</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="flex-1 overflow-y-auto">
              <div className="pr-2">
                <TaskComments
                  taskId={currentTask.id}
                  comments={taskComments}
                  onAddComment={handleAddComment}
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                  onLikeComment={handleLikeComment}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <DialogDescription className="text-xs text-muted-foreground">Task ID: {currentTask.id}</DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Assignment Modal */}
      <UserAssignmentModal
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        currentAssignees={currentTask.assignees}
        onUpdateAssignees={handleUpdateAssignees}
        taskTitle={currentTask.title}
      />
    </>
  )
}
