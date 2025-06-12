import mysql from "mysql2/promise"

// Criar pool de conexões MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
})


// Função helper para executar queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Função helper para executar queries que retornam uma única linha
export async function executeQuerySingle(query: string, params: any[] = []) {
  const results = (await executeQuery(query, params)) as any[]
  return results[0] || null
}

// Interfaces permanecem as mesmas
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
