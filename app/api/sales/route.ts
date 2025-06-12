import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/db-mysql"
import { requireAdmin } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    // Apenas admins podem ver todas as vendas
    requireAdmin(request)

    const sales = await executeQuery(`
      SELECT 
        s.*,
        m.brand,
        m.model,
        m.year,
        m.color
      FROM sales s
      LEFT JOIN motorcycles m ON s.motorcycle_id = m.id
      ORDER BY s.created_at DESC
    `)

    return NextResponse.json(sales)
  } catch (error) {
    console.error("Get sales error:", error)
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apenas admins podem criar vendas
    const user = requireAdmin(request)

    const {
      motorcycle_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_cpf,
      sale_price,
      payment_method,
      installments = 1,
      notes,
    } = await request.json()

    if (!motorcycle_id || !customer_name || !customer_email || !sale_price) {
      return NextResponse.json({ error: "Campos obrigatórios: moto, nome do cliente, email e preço" }, { status: 400 })
    }

    // Verificar se a moto está disponível
    const motorcycle = await executeQuerySingle("SELECT * FROM motorcycles WHERE id = ? AND status = 'available'", [
      motorcycle_id,
    ])

    if (!motorcycle) {
      return NextResponse.json({ error: "Moto não disponível para venda" }, { status: 400 })
    }

    // Criar a venda
    await executeQuery(
      `INSERT INTO sales (
        motorcycle_id, customer_name, customer_email, customer_phone,
        customer_cpf, sale_price, payment_method, installments, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        motorcycle_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_cpf,
        sale_price,
        payment_method,
        installments,
        notes,
        user.userId,
      ],
    )

    // Atualizar status da moto para vendida
    await executeQuerySingle("UPDATE motorcycles SET status = 'sold' WHERE id = ?", [motorcycle_id])

    const sale = await executeQuerySingle(
      "SELECT * FROM sales WHERE motorcycle_id = ? AND customer_email = ? ORDER BY id DESC LIMIT 1",
      [motorcycle_id, customer_email],
    )

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Create sale error:", error)
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }
    return NextResponse.json({ error: "Erro ao criar venda" }, { status: 500 })
  }
}
