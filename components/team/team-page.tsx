"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, UserPlus, Mail, Phone, MoreHorizontal, Users, Crown, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TeamMember {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: "admin" | "member" | "viewer"
  department: string
  joinDate: string
  tasksAssigned: number
  tasksCompleted: number
  isOnline: boolean
}

export function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "admin",
      department: "Design",
      joinDate: "2023-01-15",
      tasksAssigned: 12,
      tasksCompleted: 10,
      isOnline: true,
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@company.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "member",
      department: "Development",
      joinDate: "2023-02-20",
      tasksAssigned: 15,
      tasksCompleted: 12,
      isOnline: true,
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@company.com",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "member",
      department: "Research",
      joinDate: "2023-03-10",
      tasksAssigned: 8,
      tasksCompleted: 7,
      isOnline: false,
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@company.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "member",
      department: "Development",
      joinDate: "2023-01-30",
      tasksAssigned: 18,
      tasksCompleted: 15,
      isOnline: true,
    },
    {
      id: "5",
      name: "Eva Brown",
      email: "eva@company.com",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "member",
      department: "Development",
      joinDate: "2023-04-05",
      tasksAssigned: 10,
      tasksCompleted: 8,
      isOnline: false,
    },
    {
      id: "6",
      name: "Frank Miller",
      email: "frank@company.com",
      avatar: "/placeholder.svg?height=80&width=80",
      role: "viewer",
      department: "Documentation",
      joinDate: "2023-05-12",
      tasksAssigned: 5,
      tasksCompleted: 5,
      isOnline: true,
    },
  ]

  const departments = [...new Set(teamMembers.map((member) => member.department))]

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment
    return matchesSearch && matchesRole && matchesDepartment
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "member":
        return <Users className="h-4 w-4 text-blue-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800"
      case "member":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and their roles</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.filter((m) => m.isOnline).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.reduce((sum, member) => sum + (member.tasksAssigned - member.tasksCompleted), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0) /
                    teamMembers.reduce((sum, member) => sum + member.tasksAssigned, 0)) *
                    100,
                )}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Members */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Team Members ({filteredMembers.length})</h2>
        </div>

        {filteredMembers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No team members found matching your criteria.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{member.name}</h3>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <Badge className={`text-xs ${getRoleColor(member.role)}`}>{member.role}</Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {member.department}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{member.tasksAssigned}</div>
                      <div className="text-xs text-muted-foreground">Assigned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{member.tasksCompleted}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
