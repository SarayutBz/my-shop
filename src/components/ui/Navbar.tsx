'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Navbar() {
  const { data: session } = useSession()
  const items = useCartStore((s) => s.items)
  const [cartOpen, setCartOpen] = useState(false)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">🛍️ My Shop</Link>

        <div className="flex items-center gap-4">
          {session?.user.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm text-gray-600 hover:text-black">
              Admin
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-3">
              <img src={session.user?.image ?? ''} className="w-8 h-8 rounded-full" />
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-black"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm hover:text-gray-600">
              เข้าสู่ระบบ
            </Link>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2"
          >
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setCartOpen(false)}
          />
          <div className="w-96 bg-white h-full overflow-y-auto p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">ตะกร้าสินค้า</h2>
              <button onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <CartDrawer />
          </div>
        </div>
      )}
    </>
  )
}