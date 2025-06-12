"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      const user = JSON.parse(userData)

      // Admin pode escolher onde ir, usuário comum vai para home
      if (user.role === "admin") {
        router.push("/dashboard") // Admin vai para dashboard por padrão
      } else if (user.role === "user") {
        router.push("/home") // Usuário comum sempre vai para home
      } else {
        // Role inválido, fazer logout
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  )
}
