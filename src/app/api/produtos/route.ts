import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get("categoria");
  const busca = searchParams.get("busca");
  const featured = searchParams.get("featured");

  const where: any = { active: true };
  if (categoria) {
    const cat = await prisma.category.findUnique({ where: { slug: categoria } });
    if (cat) where.categoryId = cat.id;
  }
  if (busca) where.name = { contains: busca, mode: "insensitive" };
  if (featured === "true") where.featured = true;

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const product = await prisma.product.create({ data: body });
  return NextResponse.json(product, { status: 201 });
}
