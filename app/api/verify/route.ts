import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db/db";
import User from "../../lib/model/user";


export async function POST(req: Request) {
  try {
    await connectDB();
    const { token } = await req.json();
    if (!token) return NextResponse.json({ success: false, message: "Token missing" }, { status: 400 });

    const user = await User.findOne({ verifyToken: token });
    if (!user) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });

    if (user.verifyTokenExpiry < Date.now()) {
      await user.deleteOne({ _id: user._id });
      return NextResponse.json(
        { success: false, message: "Token expired, create new Token" },
        { status: 410 }
      );
    }

    user.verified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;
    await user.save();

    return NextResponse.json({ success:true});
  } catch (err: any) {
    console.log(err)//remove
    return NextResponse.json({ success:false, message: "Server Error" }, { status: 500 });
  }
}
