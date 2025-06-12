import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/db-mysql"
import { requireAdmin } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    // Apenas admins podem acessar todas as motos
    requireAdmin(request)

    const motorcycles = await executeQuery("SELECT * FROM motorcycles ORDER BY created_at DESC")

    return NextResponse.json(motorcycles)
  } catch (error) {
    console.error("Get motorcycles error:", error)
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }
    return NextResponse.json({ error: "Erro ao buscar motos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apenas admins podem criar motos
    requireAdmin(request)

    const {
      brand,
      model,
      year,
      price,
      color,
      engine_size,
      fuel_type,
      mileage = 0,
      description,
      image_url,
      status = "available",
    } = await request.json()

    if (!brand || !model || !year || !price) {
      return NextResponse.json({ error: "Marca, modelo, ano e preço são obrigatórios" }, { status: 400 })
    }

    await executeQuery(
      `INSERT INTO motorcycles (
        brand, model, year, price, color, engine_size, 
        fuel_type, mileage, description, image_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [brand, model, year, price, color, engine_size, fuel_type, mileage, description, image_url, status],
    )

    const motorcycle = await executeQuerySingle(
      "SELECT * FROM motorcycles WHERE brand = ? AND model = ? AND year = ? ORDER BY id DESC LIMIT 1",
      [brand, model, year],
    )

    return NextResponse.json(motorcycle)
  } catch (error) {
    console.error("Create motorcycle error:", error)
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }
    return NextResponse.json({ error: "Erro ao criar moto" }, { status: 500 })
  }
}
