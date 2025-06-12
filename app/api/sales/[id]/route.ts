import { type NextRequest, NextResponse } from "next/server"
import { executeQuerySingle } from "@/lib/db-mysql"
import { requireAuth } from "@/lib/middleware"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(request)

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_cpf,
      sale_price,
      payment_method,
      installments,
      status,
      notes,
    } = await request.json()

    const saleId = Number.parseInt(params.id)

    await executeQuerySingle(
      `UPDATE sales SET 
        customer_name = ?, customer_email = ?, customer_phone = ?, customer_cpf = ?,
        sale_price = ?, payment_method = ?, installments = ?, status = ?, notes = ?
      WHERE id = ?`,
      [
        customer_name,
        customer_email,
        customer_phone,
        customer_cpf,
        sale_price,
        payment_method,
        installments,
        status,
        notes,
        saleId,
      ],
    )

    const sale = await executeQuerySingle("SELECT * FROM sales WHERE id = ?", [saleId])

    if (!sale) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Update sale error:", error)
    return NextResponse.json({ error: "Erro ao atualizar venda" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(request)

    const saleId = Number.parseInt(params.id)

    // Buscar a venda para obter o motorcycle_id
    const sale = await executeQuerySingle("SELECT motorcycle_id FROM sales WHERE id = ?", [saleId])

    if (!sale) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 })
    }

    // Excluir a venda
    await executeQuerySingle("DELETE FROM sales WHERE id = ?", [saleId])

    // Retornar a moto para disponível
    await executeQuerySingle("UPDATE motorcycles SET status = 'available' WHERE id = ?", [sale.motorcycle_id])

    return NextResponse.json({ message: "Venda excluída com sucesso" })
  } catch (error) {
    console.error("Delete sale error:", error)
    return NextResponse.json({ error: "Erro ao excluir venda" }, { status: 500 })
  }
}
