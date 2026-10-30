import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/db/models/User";

const registerSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}