import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: Context) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const data = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data,
  });

  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}