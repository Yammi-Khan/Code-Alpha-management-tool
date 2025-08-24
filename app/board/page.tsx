import { KanbanBoard } from "@/components/kanban/kanban-board"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function BoardPage() {
  return (
    <ProtectedRoute>
      <KanbanBoard />
    </ProtectedRoute>
  )
}
