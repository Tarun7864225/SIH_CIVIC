import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/lib/model/user";
import { connectDB } from "@/app/lib/db/db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    
    await connectDB();
    const token = cookies().get("Token")?.value;

    if (!token) return NextResponse.json({ user: null });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user._id).select("-password");

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
