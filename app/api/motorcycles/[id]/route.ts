import { type NextRequest, NextResponse } from "next/server"
import { executeQuerySingle } from "@/lib/db-mysql"
import { requireAuth } from "@/lib/middleware"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(request)

    const { brand, model, year, price, color, engine_size, fuel_type, mileage, description, image_url, status } =
      await request.json()

    const motorcycleId = Number.parseInt(params.id)

    await executeQuerySingle(
      `UPDATE motorcycles SET 
        brand = ?, model = ?, year = ?, price = ?, color = ?, engine_size = ?,
        fuel_type = ?, mileage = ?, description = ?, image_url = ?, status = ?
      WHERE id = ?`,
      [brand, model, year, price, color, engine_size, fuel_type, mileage, description, image_url, status, motorcycleId],
    )

    const motorcycle = await executeQuerySingle("SELECT * FROM motorcycles WHERE id = ?", [motorcycleId])

    if (!motorcycle) {
      return NextResponse.json({ error: "Moto não encontrada" }, { status: 404 })
    }

    return NextResponse.json(motorcycle)
  } catch (error) {
    console.error("Update motorcycle error:", error)
    return NextResponse.json({ error: "Erro ao atualizar moto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(request)

    const motorcycleId = Number.parseInt(params.id)

    await executeQuerySingle("DELETE FROM motorcycles WHERE id = ?", [motorcycleId])

    return NextResponse.json({ message: "Moto excluída com sucesso" })
  } catch (error) {
    console.error("Delete motorcycle error:", error)
    return NextResponse.json({ error: "Erro ao excluir moto" }, { status: 500 })
  }
}
