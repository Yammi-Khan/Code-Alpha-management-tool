import { TeamPage } from "@/components/team/team-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TeamPageRoute() {
  return (
    <ProtectedRoute>
      <TeamPage />
    </ProtectedRoute>
  )
}
