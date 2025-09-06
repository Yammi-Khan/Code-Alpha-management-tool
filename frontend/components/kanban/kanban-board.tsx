"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, Filter, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCard } from "./task-card"
import { AddColumnModal } from "./add-column-modal"
import { AddTaskModal } from "./add-task-modal"

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

interface Column {
  id: string
  title: string
  tasks: Task[]
  color?: string
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "bg-gray-100",
      tasks: [
        {
          id: "task-1",
          title: "Design user interface mockups",
          description: "Create wireframes and high-fidelity mockups for the new dashboard",
          priority: "high",
          assignees: [
            { id: "1", name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32" },
            { id: "2", name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32" },
          ],
          dueDate: "2024-02-15",
          comments: 3,
          attachments: 2,
          labels: [
            { id: "1", name: "Design", color: "bg-purple-500" },
            { id: "2", name: "UI/UX", color: "bg-blue-500" },
          ],
        },
        {
          id: "task-2",
          title: "Research competitor analysis",
          priority: "medium",
          assignees: [{ id: "3", name: "Carol Davis", avatar: "/placeholder.svg?height=32&width=32" }],
          dueDate: "2024-02-20",
          comments: 1,
          attachments: 0,
          labels: [{ id: "3", name: "Research", color: "bg-green-500" }],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-100",
      tasks: [
        {
          id: "task-3",
          title: "Implement authentication system",
          description: "Set up user login, registration, and session management",
          priority: "urgent",
          assignees: [
            { id: "4", name: "David Wilson", avatar: "/placeholder.svg?height=32&width=32" },
            { id: "5", name: "Eva Brown", avatar: "/placeholder.svg?height=32&width=32" },
          ],
          dueDate: "2024-02-10",
          comments: 5,
          attachments: 1,
          labels: [
            { id: "4", name: "Backend", color: "bg-red-500" },
            { id: "5", name: "Security", color: "bg-orange-500" },
          ],
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "bg-yellow-100",
      tasks: [
        {
          id: "task-4",
          title: "Update project documentation",
          priority: "low",
          assignees: [{ id: "6", name: "Frank Miller", avatar: "/placeholder.svg?height=32&width=32" }],
          comments: 2,
          attachments: 3,
          labels: [{ id: "6", name: "Documentation", color: "bg-gray-500" }],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-100",
      tasks: [
        {
          id: "task-5",
          title: "Set up project repository",
          priority: "medium",
          assignees: [{ id: "7", name: "Grace Lee", avatar: "/placeholder.svg?height=32&width=32" }],
          comments: 0,
          attachments: 0,
          labels: [{ id: "7", name: "Setup", color: "bg-indigo-500" }],
        },
      ],
    },
  ])

  const [showAddColumn, setShowAddColumn] = useState(false)
  const [showAddTask, setShowAddTask] = useState<string | null>(null)

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
      })),
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      })),
    )
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")

  const getFilteredTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      return matchesSearch && matchesPriority
    })
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const task = sourceColumn.tasks.find((task) => task.id === draggableId)
    if (!task) return

    // Remove task from source column
    const newSourceTasks = sourceColumn.tasks.filter((task) => task.id !== draggableId)

    // Add task to destination column
    const newDestTasks = [...destColumn.tasks]
    newDestTasks.splice(destination.index, 0, task)

    // Update columns
    setColumns(
      columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: newSourceTasks }
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: newDestTasks }
        }
        return col
      }),
    )
  }

  const addColumn = (title: string, color: string) => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title,
      color,
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  const addTask = (columnId: string, task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    }

    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, tasks: [...col.tasks, newTask] }
        }
        return col
      }),
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 p-6 bg-gradient-to-r from-background via-primary/5 to-accent/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Project Board
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground mt-1">Manage tasks and track progress with your team</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAddColumn(true)}
              className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-all duration-300"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 min-w-max">
            {columns.map((column, columnIndex) => {
              const filteredTasks = getFilteredTasks(column.tasks)
              return (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`rounded-xl p-4 min-h-[600px] transition-all duration-300 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl ${
                          snapshot.isDraggingOver
                            ? "bg-gradient-to-b from-primary/20 to-accent/20 border-primary/40 scale-[1.02]"
                            : "bg-gradient-to-b from-card/80 to-muted/40 hover:from-card/90 hover:to-muted/50"
                        }`}
                        style={{
                          animationDelay: `${columnIndex * 100}ms`,
                        }}
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4 p-2 rounded-lg bg-gradient-to-r from-background/50 to-primary/5 backdrop-blur-sm">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">{column.title}</h3>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-primary/10 text-primary border-primary/20 animate-pulse"
                            >
                              {filteredTasks.length}
                              {filteredTasks.length !== column.tasks.length && ` of ${column.tasks.length}`}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAddTask(column.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-3">
                          {filteredTasks.map((task, index) => {
                            const originalIndex = column.tasks.findIndex((t) => t.id === task.id)
                            return (
                              <Draggable key={task.id} draggableId={task.id} index={originalIndex}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`transition-all duration-300 ${
                                      snapshot.isDragging
                                        ? "rotate-3 scale-105 shadow-2xl z-50"
                                        : "hover:scale-[1.02] hover:shadow-lg"
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                      animationDelay: `${index * 50}ms`,
                                    }}
                                  >
                                    <TaskCard
                                      task={task}
                                      onUpdateTask={handleUpdateTask}
                                      onDeleteTask={handleDeleteTask}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      <AddColumnModal open={showAddColumn} onOpenChange={setShowAddColumn} onAddColumn={addColumn} />

      {showAddTask && (
        <AddTaskModal
          open={!!showAddTask}
          onOpenChange={() => setShowAddTask(null)}
          onAddTask={(task) => addTask(showAddTask, task)}
          columnTitle={columns.find((col) => col.id === showAddTask)?.title || ""}
        />
      )}
    </div>
  )
}
