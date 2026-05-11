"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });
    setForm({ name: "", description: "", price: "", stock: "", image: "" });
    await fetchProducts();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบสินค้านี้?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetchProducts();
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">จัดการสินค้า</h1>

      {/* Form เพิ่มสินค้า */}
      <div className="bg-white border rounded-xl p-6 mb-10 grid grid-cols-2 gap-4">
        <h2 className="col-span-2 font-semibold">เพิ่มสินค้าใหม่</h2>
        {(["name", "description", "price", "stock", "image"] as const).map(
          (field) => (
            <input
              key={field}
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm col-span-1"
            />
          ),
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="col-span-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "กำลังเพิ่ม..." : "เพิ่มสินค้า"}
        </button>
      </div>

      {/* รายการสินค้า */}
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border rounded-xl px-4 py-3"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">
                ฿{p.price} · stock: {p.stock}
              </p>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-500 text-sm hover:underline"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
