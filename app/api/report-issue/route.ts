import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db/db";
import Issue from "@/app/lib/model/issue";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { user, id, issue, category, priority, location, description, email, image, phone, status } = await req.json();

    const userData = {
      user,
      id,
      issue,
      category,
      priority,
      location,
      description,
      email,
      image: image ?? null,
      phone: phone ?? null,
      status
    }

    await Issue.create(userData);
    return NextResponse.json({ message: "Issue Reported" }, { status: 201 });
  } catch(error:any){
    console.log(error)
    return NextResponse.json({ message: "Error Reporting Issue" }, { status: 500} )
  }
}
