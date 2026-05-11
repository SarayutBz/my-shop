import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

//* GET /api/products — ดึงสินค้าทั้งหมด
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

//* POST /api/products — เพิ่มสินค้า (admin only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description, price, image, stock } = await req.json()

  const product = await prisma.product.create({
    data: { name, description, price, image, stock },
  })

  return NextResponse.json(product, { status: 201 })
}