"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Bike, ShoppingCart, TrendingUp, Plus, Home } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalMotorcycles: number
  totalSales: number
  availableMotorcycles: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMotorcycles: 0,
    totalSales: 0,
    availableMotorcycles: 0,
  })
  const [loading, setLoading] = useState(true)
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

    // Apenas usuários comuns são redirecionados
    if (parsedUser.role === "user") {
      router.push("/home")
      return
    }

    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")

      const [usersRes, motorcyclesRes, salesRes] = await Promise.all([
        fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/motorcycles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/sales", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const users = await usersRes.json()
      const motorcycles = await motorcyclesRes.json()
      const sales = await salesRes.json()

      setStats({
        totalUsers: users.length,
        totalMotorcycles: motorcycles.length,
        totalSales: sales.length,
        availableMotorcycles: motorcycles.filter((m: any) => m.status === "available").length,
      })
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
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
              <Bike className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">MotoShop Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Admin pode acessar a home também */}
              <Button asChild variant="outline">
                <Link href="/home">
                  <Home className="mr-2 h-4 w-4" />
                  Ver Loja
                </Link>
              </Button>
              <span className="text-sm text-gray-600">
                Bem-vindo, <span className="font-medium">{user?.name}</span> ({user?.role})
              </span>
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Usuários do sistema</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Motos</CardTitle>
                <Bike className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMotorcycles}</div>
                <p className="text-xs text-muted-foreground">{stats.availableMotorcycles} disponíveis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSales}</div>
                <p className="text-xs text-muted-foreground">Vendas realizadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Vendas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalMotorcycles > 0 ? Math.round((stats.totalSales / stats.totalMotorcycles) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Motos vendidas</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>Cadastre, edite e gerencie usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href="/users">
                      <Users className="mr-2 h-4 w-4" />
                      Ver Usuários
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Motos</CardTitle>
                <CardDescription>Cadastre, edite e gerencie o estoque de motocicletas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href="/motorcycles">
                      <Bike className="mr-2 h-4 w-4" />
                      Ver Motos
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sistema de Vendas</CardTitle>
                <CardDescription>Realize vendas e gerencie o histórico de transações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href="/sales">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Ver Vendas
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/sales/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Venda
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
