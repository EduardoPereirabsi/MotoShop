import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: string
  created_at: string
  updated_at: string
}

export interface Motorcycle {
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
  updated_at: string
}

export interface Sale {
  id: number
  motorcycle_id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf: string
  sale_price: number
  payment_method: string
  installments: number
  sale_date: string
  status: string
  notes: string
  created_by: number
  created_at: string
  motorcycle?: Motorcycle
}
