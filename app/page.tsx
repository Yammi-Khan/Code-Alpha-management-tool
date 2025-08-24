import { Sidebar } from "@/components/sidebar"
import { ProjectDashboard } from "@/components/project-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <ProjectDashboard />
        </main>
      </div>
    </ProtectedRoute>
  )
}
