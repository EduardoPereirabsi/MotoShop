import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface JWTPayload {
  userId: number
  email: string
  role: string
}

// Função para verificar se é admin
export function isAdmin(user: JWTPayload | null): boolean {
  return user?.role === "admin"
}

// Função para verificar se é usuário comum
export function isUser(user: JWTPayload | null): boolean {
  return user?.role === "user"
}

// Função para verificar se pode acessar área administrativa
export function canAccessAdmin(user: JWTPayload | null): boolean {
  return user?.role === "admin"
}

// Função para verificar se deve ser redirecionado para home
export function shouldRedirectToHome(user: JWTPayload | null): boolean {
  return user?.role === "user"
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
