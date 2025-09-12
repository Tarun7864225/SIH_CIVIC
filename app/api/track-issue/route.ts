import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db/db";
import Issue from "@/app/lib/model/issue";
import User from "@/app/lib/model/user";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    if (!user.verified) return NextResponse.json({ message: "Please verify your email" }, { status: 400 });
    const issues = await Issue.find({ user: user._id }).populate("user");
    const formattedIssues = issues.map((issue: any) => ({
        id: issue.id || issue._id.toString(),           // Use DB id if custom id missing
        trackingNumber: issue.user?._id?.toString() || "N/A",
        title: issue.issue || "N/A",
        description: issue.description || "",
        category: issue.category || "N/A",
        location: issue.location || "N/A",
        priority: issue.priority || "low",
        contactEmail: issue.email || issue.user?.email || "N/A",
        contactPhone: issue.phone || "000000000",
        images: issue.image || "image",
        reportedBy: issue.user?.name || "Unknown",
        reportedAt: issue.createdAt,
        status: issue.status || "in-progress",
        userType: issue.user?.userType || "user",
        resolvedAt: "in-progress",
        resolvedBy: "in-progress"
        }));

    console.log(formattedIssues)
    return NextResponse.json({ issues:formattedIssues },{status:201});

  } catch(error:any){
    console.log(error)
    return NextResponse.json({ message: "Error Reporting Issue" }, { status: 500} )
  }
}
