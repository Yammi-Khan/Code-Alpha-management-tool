"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCreationModal } from "@/components/project-creation-modal"
import {
  MoreHorizontal,
  Calendar,
  Users,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowUp,
} from "lucide-react"

export function ProjectDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      progress: 75,
      dueDate: "2024-02-15",
      priority: "high",
      members: [
        { name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Carol Davis", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      status: "In Progress",
      tasksCompleted: 9,
      totalTasks: 12,
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Native iOS and Android app for customer engagement",
      progress: 45,
      dueDate: "2024-03-01",
      priority: "medium",
      members: [
        { name: "David Wilson", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Eva Brown", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      status: "In Progress",
      tasksCompleted: 4,
      totalTasks: 8,
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q1 digital marketing campaign across all channels",
      progress: 90,
      dueDate: "2024-01-30",
      priority: "urgent",
      members: [
        { name: "Frank Miller", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Grace Lee", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Henry Taylor", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Ivy Chen", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      status: "Review",
      tasksCompleted: 14,
      totalTasks: 15,
    },
  ])

  const handleProjectCreate = (newProject: any) => {
    setProjects([...projects, newProject])
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status.toLowerCase().replace(" ", "-") === filterStatus
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 shadow-red-500/20"
      case "high":
        return "bg-orange-500 shadow-orange-500/20"
      case "medium":
        return "bg-yellow-500 shadow-yellow-500/20"
      case "low":
        return "bg-green-500 shadow-green-500/20"
      default:
        return "bg-gray-500 shadow-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Review":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background via-primary/5 to-accent/5 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Dashboard
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <ProjectCreationModal onProjectCreate={handleProjectCreate} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-sm border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                +2 from last month
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card/80 to-accent/5 backdrop-blur-sm border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <div className="p-2 bg-accent/10 rounded-full">
                <Clock className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {projects.reduce((sum, project) => sum + (project.totalTasks - project.tasksCompleted), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card/80 to-blue-500/5 backdrop-blur-sm border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">8</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                +1 new member
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card/80 to-green-500/5 backdrop-blur-sm border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {Math.round(
                  (projects.reduce((sum, project) => sum + project.tasksCompleted, 0) /
                    projects.reduce((sum, project) => sum + project.totalTasks, 0)) *
                    100,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Projects Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Projects ({filteredProjects.length})</h2>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-card/80 to-muted/40 backdrop-blur-sm border border-border/50">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group hover:scale-[1.02] bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm border border-border/50"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full shadow-lg ${getPriorityColor(project.priority)}`} />
                        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                          {project.name}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-medium text-primary">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>
                          {project.tasksCompleted} of {project.totalTasks} tasks
                        </span>
                      </div>
                    </div>

                    {/* Due Date and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                        <Calendar className="h-4 w-4 mr-1" />
                        {project.dueDate}
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(project.status)}
                        <Badge
                          variant={project.status === "Review" ? "secondary" : "default"}
                          className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        Team ({project.members.length})
                      </div>
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, memberIndex) => (
                          <Avatar
                            key={memberIndex}
                            className="h-6 w-6 border-2 border-background hover:scale-110 transition-transform duration-200 shadow-sm"
                            style={{ zIndex: project.members.length - memberIndex }}
                          >
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-accent/20">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-muted to-primary/20 border-2 border-background flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200">
                            <span className="text-xs font-medium">+{project.members.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
