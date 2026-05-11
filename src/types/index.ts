import { DefaultSession } from 'next-auth'

// extend NextAuth Session ให้มี id กับ role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

// Product type (ใช้ทั้ง frontend + backend)
export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  stock: number
  createdAt: Date
}

// Cart item (ใช้ใน Zustand store)
export type CartItem = {
  productId: string
  name: string
  price: number
  image: string | null
  quantity: number
}

// Order status
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'