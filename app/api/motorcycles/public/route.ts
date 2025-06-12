import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db-mysql"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    // Qualquer usuário autenticado pode ver motos disponíveis
    requireAuth(request)

    // Retornar apenas motos disponíveis
    const motorcycles = await executeQuery(
      "SELECT * FROM motorcycles WHERE status = 'available' ORDER BY created_at DESC",
    )

    return NextResponse.json(motorcycles)
  } catch (error) {
    console.error("Get public motorcycles error:", error)
    return NextResponse.json({ error: "Erro ao buscar motos" }, { status: 500 })
  }
}
