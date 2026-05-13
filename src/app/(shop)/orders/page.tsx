import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

const statusLabel: Record<string, string> = {
  PENDING: ' รอชำระ',
  PAID: ' ชำระแล้ว',
  CANCELLED: ' ยกเลิก',
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">ประวัติการสั่งซื้อ</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">ยังไม่มีคำสั่งซื้อ</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('th-TH')}
                </span>
                <span className="text-sm font-medium">
                  {statusLabel[order.status]}
                </span>
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                <span>รวม</span>
                <span>฿{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}