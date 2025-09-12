import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db/db";
import User from "@/app/lib/model/user";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    if (!user.verified) return NextResponse.json({ message: "Please verify your email" }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "1h" });
    if(!token) return NextResponse.json({message: "Sign In Again"})

    const response = NextResponse.json({ message: "Logged in successfully!", user });
    response.cookies.set("Token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
