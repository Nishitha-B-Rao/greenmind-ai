import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import dbConnect from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import User from "@/models/User";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    await dbConnect();
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Wait for params to be resolved in Next.js 15
    const resolvedParams = await params;

    const challenge = await Challenge.findOneAndUpdate(
      { _id: resolvedParams.id, userId: user._id },
      { status: "completed", completedAt: new Date() },
      { new: true }
    );

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, challenge });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to complete challenge" }, { status: 500 });
  }
}
