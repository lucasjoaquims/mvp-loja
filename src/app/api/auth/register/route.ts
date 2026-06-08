import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erro ao registrar" }, { status: 400 });
  }
}
