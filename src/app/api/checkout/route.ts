import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/types";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบก่อน" },
      { status: 401 },
    );
  }

  const { items }: { items: CartItem[] } = await req.json();
  console.log(items);
  console.log(
    items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      stripeAmount: Math.round(item.price * 100),
    })),
  );
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "ตะกร้าว่างเปล่า" }, { status: 400 });
  }

  // สร้าง Order ใน DB ก่อน (status: PENDING)
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: "PENDING",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  // สร้าง Stripe Checkout Session
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "promptpay"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "thb",
        product_data: {
          name: item.name,
            images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // สตางค์
      },
      quantity: item.quantity,
    })),
    metadata: {
      orderId: order.id, // ส่ง orderId ไปกับ Stripe เพื่อใช้ใน Webhook
    },
    success_url: `${process.env.NEXTAUTH_URL}/orders?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
  });

  // อัป stripeId ลง Order
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeId: stripeSession.id },
  });

  return NextResponse.json({ url: stripeSession.url });
}
