"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Bike, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Motorcycle {
  id: number
  brand: string
  model: string
  year: number
  price: number
  color: string
  status: string
}

export default function NewSalePage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    motorcycle_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_cpf: "",
    sale_price: 0,
    payment_method: "",
    installments: 1,
    notes: "",
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchMotorcycles()
  }, [router])

  const fetchMotorcycles = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/motorcycles", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar motos")
      }

      const data = await response.json()
      setMotorcycles(data.filter((m: Motorcycle) => m.status === "available"))
    } catch (error) {
      console.error("Erro ao buscar motos:", error)
      setError("Erro ao carregar motos disponíveis")
    } finally {
      setLoading(false)
    }
  }

  const handleMotorcycleChange = (motorcycleId: string) => {
    const motorcycle = motorcycles.find((m) => m.id.toString() === motorcycleId)
    setFormData({
      ...formData,
      motorcycle_id: motorcycleId,
      sale_price: motorcycle ? motorcycle.price : 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          motorcycle_id: Number.parseInt(formData.motorcycle_id),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao realizar venda")
      }

      setSuccess("Venda realizada com sucesso!")

      // Reset form
      setFormData({
        motorcycle_id: "",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_cpf: "",
        sale_price: 0,
        payment_method: "",
        installments: 1,
        notes: "",
      })

      // Refresh available motorcycles
      await fetchMotorcycles()

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/sales")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao realizar venda")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button asChild variant="ghost" className="mr-4">
                <Link href="/sales">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <Bike className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Nova Venda</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <CardTitle>Sistema de Vendas - MotoShop</CardTitle>
                  <CardDescription>Preencha os dados para realizar uma nova venda</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Seleção da Moto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Selecionar Motocicleta</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="motorcycle">Moto Disponível</Label>
                      <Select value={formData.motorcycle_id} onValueChange={handleMotorcycleChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma moto disponível" />
                        </SelectTrigger>
                        <SelectContent>
                          {motorcycles.map((motorcycle) => (
                            <SelectItem key={motorcycle.id} value={motorcycle.id.toString()}>
                              {motorcycle.brand} {motorcycle.model} {motorcycle.year} - {motorcycle.color} - R${" "}
                              {motorcycle.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dados do Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados do Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customer_name">Nome Completo *</Label>
                      <Input
                        id="customer_name"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="customer_email">Email *</Label>
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="customer_phone">Telefone</Label>
                      <Input
                        id="customer_phone"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="customer_cpf">CPF</Label>
                      <Input
                        id="customer_cpf"
                        value={formData.customer_cpf}
                        onChange={(e) => setFormData({ ...formData, customer_cpf: e.target.value })}
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                </div>

                {/* Dados da Venda */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados da Venda</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="sale_price">Preço de Venda (R$) *</Label>
                      <Input
                        id="sale_price"
                        type="number"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({ ...formData, sale_price: Number.parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment_method">Forma de Pagamento *</Label>
                      <Select
                        value={formData.payment_method}
                        onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                          <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                          <SelectItem value="Financiamento">Financiamento</SelectItem>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Transferência">Transferência</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="installments">Parcelas</Label>
                      <Input
                        id="installments"
                        type="number"
                        min="1"
                        max="60"
                        value={formData.installments}
                        onChange={(e) => setFormData({ ...formData, installments: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Observações</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observações Adicionais</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Informações adicionais sobre a venda..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/sales">Cancelar</Link>
                  </Button>
                  <Button type="submit" disabled={submitting || !formData.motorcycle_id}>
                    {submitting ? "Processando..." : "Finalizar Venda"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
