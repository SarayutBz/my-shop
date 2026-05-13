'use client'

import { useCartStore } from '@/store/cartStore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setLoading(true)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })

    const data = await res.json()

    if (data.url) {
      clearCart()
      window.location.href = data.url // redirect ไป Stripe Checkout
    } else {
      alert(data.error ?? 'เกิดข้อผิดพลาด')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-6 py-20 text-center">
        <p className="text-gray-400 text-lg">ตะกร้าว่างเปล่า</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm underline text-gray-600"
        >
          กลับไปเลือกสินค้า
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">สรุปคำสั่งซื้อ</h1>

      <div className="bg-white border rounded-xl p-6 flex flex-col gap-4 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span>฿{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}

        <div className="border-t pt-4 flex justify-between font-bold">
          <span>รวมทั้งหมด</span>
          <span>฿{total().toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? 'กำลังโหลด...' : 'ชำระเงิน (บัตร / PromptPay)'}
      </button>
    </main>
  )
}