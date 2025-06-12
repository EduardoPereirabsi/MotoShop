import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/db-mysql"
import { requireAdmin } from "@/lib/middleware"
import { hashPassword } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Apenas admins podem acessar a lista de usuários
    requireAdmin(request)

    const users = await executeQuery(
      "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC",
    )

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apenas admins podem criar usuários
    requireAdmin(request)

    const { name, email, password, role = "user" } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    await executeQuery("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
      name,
      email,
      hashedPassword,
      role,
    ])

    const user = await executeQuerySingle(
      "SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = ?",
      [email],
    )

    return NextResponse.json(user)
  } catch (error) {
    console.error("Create user error:", error)
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
