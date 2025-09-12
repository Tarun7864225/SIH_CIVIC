import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "../../lib/db/db"; 
import User from "../../lib/model/user";
import nodemailer from "nodemailer";

async function sendMail(email: string, verifyToken: string) {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Civic App" <no-reply@team.com>',
    to: email,
    subject: "Email Verification",
    html: `<p>Click <a href="http://${process.env.SITE}/verify/${verifyToken}">here</a> to verify your account. Link expires in 1 hour.</p>`,
  });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password, userType, phone, adminId, department, governmentId, location } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 3600 * 1000);

    const userData = {
        name,
        email,
        password: hashedPassword,
        userType,
        phone: phone ?? null,
        adminId: adminId ?? null,
        department: department ?? null,
        governmentId: governmentId ?? null,
        location: location ?? null,
        verifyToken,
        verifyTokenExpiry,
    };

    await User.create(userData);

    await sendMail(email, verifyToken);
    return NextResponse.json({ message: "User created! Check your email to verify" }, { status: 201 });
  } catch (err: any) {
    console.error(err);//remove
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
