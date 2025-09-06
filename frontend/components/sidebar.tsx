"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Home, Users, Settings, ChevronLeft, ChevronRight, Kanban } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const projects = [
    { id: 1, name: "Website Redesign", tasks: 12, color: "bg-blue-500" },
    { id: 2, name: "Mobile App", tasks: 8, color: "bg-green-500" },
    { id: 3, name: "Marketing Campaign", tasks: 15, color: "bg-purple-500" },
  ]

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Kanban, label: "Board", path: "/board" },
    { icon: Users, label: "Team", path: "/team" },
  ]

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 shadow-lg ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-accent/5">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-sidebar-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CollabBoard
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:scale-105"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => router.push(item.path)}
                className={`w-full justify-start transition-all duration-200 hover:scale-[1.02] ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            )
          })}

          {/* Projects Section */}
          {!isCollapsed && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-sidebar-foreground">Projects</h3>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:scale-110 transition-transform">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-1">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="p-2 cursor-pointer hover:bg-sidebar-accent transition-all duration-200 hover:scale-[1.02] hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${project.color} shadow-sm`} />
                      <span className="text-sm font-medium text-sidebar-foreground truncate">{project.name}</span>
                      <Badge
                        variant="secondary"
                        className="ml-auto text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {project.tasks}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu and Settings */}
        <div className="p-4 border-t border-sidebar-border space-y-2 bg-gradient-to-r from-muted/30 to-transparent">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-2">
              <UserMenu />
              <ThemeToggle />
            </div>
          )}

          {isCollapsed && (
            <div className="flex flex-col items-center space-y-2">
              <ThemeToggle />
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:scale-[1.02]"
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
