"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition">
      <img
        src={product.image ?? "/placeholder.png"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-lg">
            ฿{product.price.toLocaleString()}
          </span>
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
              })
            }
            disabled={product.stock === 0}
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-40"
          >
            {product.stock === 0 ? "หมด" : "เพิ่มลงตะกร้า"}
          </button>
        </div>
      </div>
    </div>
  );
}
