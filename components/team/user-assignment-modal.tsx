"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, UserPlus, X, Check } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "member" | "viewer"
  department?: string
  isOnline?: boolean
}

interface UserAssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAssignees: User[]
  onUpdateAssignees: (assignees: User[]) => void
  taskTitle: string
}

export function UserAssignmentModal({
  open,
  onOpenChange,
  currentAssignees,
  onUpdateAssignees,
  taskTitle,
}: UserAssignmentModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>(currentAssignees)

  // Mock team members data
  const teamMembers: User[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "admin",
      department: "Design",
      isOnline: true,
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      department: "Development",
      isOnline: true,
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      department: "Research",
      isOnline: false,
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      department: "Development",
      isOnline: true,
    },
    {
      id: "5",
      name: "Eva Brown",
      email: "eva@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      department: "Development",
      isOnline: false,
    },
    {
      id: "6",
      name: "Frank Miller",
      email: "frank@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "viewer",
      department: "Documentation",
      isOnline: true,
    },
    {
      id: "7",
      name: "Grace Lee",
      email: "grace@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      department: "DevOps",
      isOnline: true,
    },
    {
      id: "8",
      name: "Henry Taylor",
      email: "henry@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      department: "Marketing",
      isOnline: false,
    },
  ]

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUserToggle = (user: User) => {
    const isSelected = selectedUsers.some((u) => u.id === user.id)
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleSave = () => {
    onUpdateAssignees(selectedUsers)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedUsers(currentAssignees)
    onOpenChange(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "member":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Assign Team Members</span>
          </DialogTitle>
          <DialogDescription>Assign team members to "{taskTitle}"</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Selected ({selectedUsers.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center space-x-1 pr-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleUserToggle(user)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Team Members List */}
          <div className="flex-1 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Team Members</h4>
            <div className="space-y-2">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2" />
                  <p>No team members found</p>
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const isSelected = selectedUsers.some((u) => u.id === member.id)
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleUserToggle(member)}
                    >
                      <Checkbox checked={isSelected} onChange={() => handleUserToggle(member)} />

                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          {member.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${getRoleColor(member.role)}`}>{member.role}</Badge>
                          {member.department && (
                            <Badge variant="outline" className="text-xs">
                              {member.department}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Assign {selectedUsers.length} {selectedUsers.length === 1 ? "Member" : "Members"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
