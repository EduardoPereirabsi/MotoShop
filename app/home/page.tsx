"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bike, Search, Filter, Heart, Phone, Mail, Settings } from "lucide-react"
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
}

export default function HomePage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    fetchMotorcycles()
  }, [router])

  const fetchMotorcycles = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/motorcycles/public", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar motos")
      }

      const data = await response.json()
      const availableMotorcycles = data.filter((m: Motorcycle) => m.status === "available")
      setMotorcycles(availableMotorcycles)
      setFilteredMotorcycles(availableMotorcycles)
    } catch (error) {
      console.error("Erro ao buscar motos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const filterMotorcycles = () => {
    let filtered = motorcycles

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (brandFilter && brandFilter !== "all") {
      filtered = filtered.filter((m) => m.brand === brandFilter)
    }

    if (priceFilter && priceFilter !== "all") {
      switch (priceFilter) {
        case "0-20000":
          filtered = filtered.filter((m) => m.price <= 20000)
          break
        case "20000-40000":
          filtered = filtered.filter((m) => m.price > 20000 && m.price <= 40000)
          break
        case "40000+":
          filtered = filtered.filter((m) => m.price > 40000)
          break
      }
    }

    setFilteredMotorcycles(filtered)
  }

  useEffect(() => {
    filterMotorcycles()
  }, [searchTerm, brandFilter, priceFilter, motorcycles])

  const uniqueBrands = Array.from(new Set(motorcycles.map((m) => m.brand)))

  const handleContactClick = (motorcycle: Motorcycle) => {
    const message = `Olá! Tenho interesse na ${motorcycle.brand} ${motorcycle.model} ${motorcycle.year}. Gostaria de mais informações.`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando catálogo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Bike className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MotoShop</h1>
                <p className="text-sm text-gray-600">Sua moto dos sonhos está aqui</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Mostrar botão de admin apenas para admins */}
              {user?.role === "admin" && (
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    <Settings className="mr-2 h-4 w-4" />
                    Painel Admin
                  </Link>
                </Button>
              )}
              <span className="text-sm text-gray-600">
                Bem-vindo, <span className="font-medium">{user?.name}</span>
                {user?.role === "admin" && <span className="text-blue-600 ml-1">(Admin)</span>}
              </span>
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Encontre Sua Moto Ideal</h2>
          <p className="text-xl mb-8">Mais de {motorcycles.length} motos disponíveis para você</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar por marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium text-gray-700">Filtros:</span>
            </div>

            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as marcas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as marcas</SelectItem>
                {uniqueBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Faixa de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="0-20000">Até R$ 20.000</SelectItem>
                <SelectItem value="20000-40000">R$ 20.000 - R$ 40.000</SelectItem>
                <SelectItem value="40000+">Acima de R$ 40.000</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || brandFilter !== "all" || priceFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setBrandFilter("all")
                  setPriceFilter("all")
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Motorcycles Grid */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? "moto encontrada" : "motos encontradas"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMotorcycles.map((motorcycle) => (
            <Card key={motorcycle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {motorcycle.image_url ? (
                  <img
                    src={motorcycle.image_url || "/placeholder.svg"}
                    alt={`${motorcycle.brand} ${motorcycle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bike className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {motorcycle.year}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">
                  {motorcycle.brand} {motorcycle.model}
                </CardTitle>
                <CardDescription className="text-lg font-semibold text-green-600">
                  R$ {motorcycle.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cor:</span>
                    <span className="font-medium">{motorcycle.color}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cilindradas:</span>
                    <span className="font-medium">{motorcycle.engine_size}cc</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Combustível:</span>
                    <span className="font-medium">{motorcycle.fuel_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quilometragem:</span>
                    <span className="font-medium">{motorcycle.mileage.toLocaleString("pt-BR")} km</span>
                  </div>
                </div>

                {motorcycle.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{motorcycle.description}</p>
                )}

                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={() => handleContactClick(motorcycle)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Entrar em Contato
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMotorcycles.length === 0 && (
          <div className="text-center py-12">
            <Bike className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma moto encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Bike className="h-8 w-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-bold">MotoShop</h3>
              </div>
              <p className="text-gray-300">Sua concessionária de confiança. Encontre a moto perfeita para você.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(41) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>contato@motoshop.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Horário de Funcionamento</h4>
              <div className="space-y-1 text-gray-300">
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 16h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 MotoShop. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
