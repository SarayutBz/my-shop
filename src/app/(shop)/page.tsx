import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">สินค้าทั้งหมด</h1>
      {products.length === 0 ? (
        <p className="text-gray-400">ยังไม่มีสินค้า</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}