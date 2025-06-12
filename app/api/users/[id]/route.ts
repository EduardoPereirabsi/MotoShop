import { type NextRequest, NextResponse } from "next/server"
import { executeQuerySingle } from "@/lib/db-mysql"
import { requireAuth } from "@/lib/middleware"
import { hashPassword } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(request)

    const { name, email, password, role } = await request.json()
    const userId = Number.parseInt(params.id)

    let user
    if (password) {
      const hashedPassword = await hashPassword(password)
      await executeQuerySingle("UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?", [
        name,
        email,
        hashedPassword,
        role,
        userId,
      ])
    } else {
      await executeQuerySingle("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [
        name,
        email,
        role,
        userId,
      ])
    }

    user = await executeQuerySingle("SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?", [
      userId,
    ])

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(request)

    const userId = Number.parseInt(params.id)

    const result = await executeQuerySingle("DELETE FROM users WHERE id = ?", [userId])

    return NextResponse.json({ message: "Usuário excluído com sucesso" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 })
  }
}
