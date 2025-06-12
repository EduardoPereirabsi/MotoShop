"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, ArrowLeft, Bike } from "lucide-react"
import Link from "next/link"

interface Motorcycle {
  id: number
  brand: string
  model: string
  year: number
  price: number
  color: string
  engine_size: number
  fuel_type: string
  mileage: number
  description: string
  image_url?: string
  status: string
  created_at: string
}

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | null>(null)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    color: "",
    engine_size: 0,
    fuel_type: "Gasolina",
    mileage: 0,
    description: "",
    image_url: "",
    status: "available",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
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
      setMotorcycles(data)
    } catch (error) {
      console.error("Erro ao buscar motos:", error)
      setError("Erro ao carregar motos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const url = editingMotorcycle ? `/api/motorcycles/${editingMotorcycle.id}` : "/api/motorcycles"
      const method = editingMotorcycle ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao salvar moto")
      }

      await fetchMotorcycles()
      setDialogOpen(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar moto")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta moto?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/motorcycles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir moto")
      }

      await fetchMotorcycles()
    } catch (error) {
      console.error("Erro ao excluir moto:", error)
      alert("Erro ao excluir moto")
    }
  }

  const openEditDialog = (motorcycle: Motorcycle) => {
    setEditingMotorcycle(motorcycle)
    setFormData({
      brand: motorcycle.brand,
      model: motorcycle.model,
      year: motorcycle.year,
      price: motorcycle.price,
      color: motorcycle.color,
      engine_size: motorcycle.engine_size,
      fuel_type: motorcycle.fuel_type,
      mileage: motorcycle.mileage,
      description: motorcycle.description,
      image_url: motorcycle.image_url || "",
      status: motorcycle.status,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingMotorcycle(null)
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      color: "",
      engine_size: 0,
      fuel_type: "Gasolina",
      mileage: 0,
      description: "",
      image_url: "",
      status: "available",
    })
    setError("")
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      available: "default",
      sold: "secondary",
      maintenance: "destructive",
    } as const

    const labels = {
      available: "Disponível",
      sold: "Vendida",
      maintenance: "Manutenção",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando motos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Button asChild variant="ghost" className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <Bike className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Motos</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Estoque de Motocicletas</CardTitle>
                  <CardDescription>Gerencie o catálogo de motos do MotoShop</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Moto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingMotorcycle ? "Editar Moto" : "Nova Moto"}</DialogTitle>
                      <DialogDescription>
                        {editingMotorcycle
                          ? "Edite as informações da motocicleta"
                          : "Preencha os dados para cadastrar uma nova moto"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="brand">Marca</Label>
                            <Input
                              id="brand"
                              value={formData.brand}
                              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="model">Modelo</Label>
                            <Input
                              id="model"
                              value={formData.model}
                              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="year">Ano</Label>
                            <Input
                              id="year"
                              type="number"
                              value={formData.year}
                              onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="price">Preço (R$)</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="color">Cor</Label>
                            <Input
                              id="color"
                              value={formData.color}
                              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="engine_size">Cilindradas</Label>
                            <Input
                              id="engine_size"
                              type="number"
                              value={formData.engine_size}
                              onChange={(e) =>
                                setFormData({ ...formData, engine_size: Number.parseInt(e.target.value) })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="fuel_type">Combustível</Label>
                            <Select
                              value={formData.fuel_type}
                              onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Gasolina">Gasolina</SelectItem>
                                <SelectItem value="Álcool">Álcool</SelectItem>
                                <SelectItem value="Flex">Flex</SelectItem>
                                <SelectItem value="Elétrica">Elétrica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="mileage">Quilometragem</Label>
                            <Input
                              id="mileage"
                              type="number"
                              value={formData.mileage}
                              onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Disponível</SelectItem>
                              <SelectItem value="sold">Vendida</SelectItem>
                              <SelectItem value="maintenance">Manutenção</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="image_url">URL da Imagem</Label>
                          <Input
                            id="image_url"
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descreva as características da moto..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting}>
                          {submitting ? "Salvando..." : "Salvar"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KM</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motorcycles.map((motorcycle) => (
                    <TableRow key={motorcycle.id}>
                      <TableCell className="font-medium">
                        {motorcycle.brand} {motorcycle.model}
                      </TableCell>
                      <TableCell>{motorcycle.year}</TableCell>
                      <TableCell>R$ {motorcycle.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{motorcycle.color}</TableCell>
                      <TableCell>{getStatusBadge(motorcycle.status)}</TableCell>
                      <TableCell>{motorcycle.mileage.toLocaleString("pt-BR")} km</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(motorcycle)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(motorcycle.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
