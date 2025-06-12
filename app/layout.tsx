import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MotoShop App',
  description: 'Sua moto dos sonhos está aqui'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
