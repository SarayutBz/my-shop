'use client'

import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'

export default function CartDrawer() {
  const { items, removeItem, updateQty, total } = useCartStore()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20">
        ตะกร้าว่างเปล่า
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.productId} className="flex gap-3 items-center border-b pb-4">
          <img
            src={item.image ?? '/placeholder.png'}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-gray-500 text-sm">฿{item.price.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => updateQty(item.productId, item.quantity - 1)}
                className="w-6 h-6 rounded border text-sm"
              >−</button>
              <span className="text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.productId, item.quantity + 1)}
                className="w-6 h-6 rounded border text-sm"
              >+</button>
            </div>
          </div>
          <button
            onClick={() => removeItem(item.productId)}
            className="text-red-400 text-sm"
          >ลบ</button>
        </div>
      ))}

      <div className="flex justify-between font-semibold text-lg pt-2">
        <span>รวม</span>
        <span>฿{total().toLocaleString()}</span>
      </div>

      <button
        onClick={() => router.push('/checkout')}
        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
      >
        ชำระเงิน
      </button>
    </div>
  )
}