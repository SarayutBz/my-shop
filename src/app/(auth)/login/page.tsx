import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/ui/LoginButton";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // ถ้า login อยู่แล้ว → ไปหน้าหลัก
  if (session) redirect("/");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-2">เข้าสู่ระบบ</h1>
        <p className="text-gray-500 text-sm mb-8">
          เข้าสู่ระบบเพื่อสั่งซื้อสินค้า
        </p>
        <LoginButton />
      </div>
    </main>
  );
}
