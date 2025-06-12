import type { NextRequest } from "next/server"
import { verifyToken } from "./auth"

export function getAuthUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export function requireAuth(request: NextRequest) {
  const user = getAuthUser(request)

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

// Nova função para verificar se é admin
export function requireAdmin(request: NextRequest) {
  const user = requireAuth(request)

  if (user.role !== "admin") {
    throw new Error("Admin access required")
  }

  return user
}
