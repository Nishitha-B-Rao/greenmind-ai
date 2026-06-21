import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import dbConnect from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import Challenge from "@/models/Challenge";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    await dbConnect();
    const user = await User.findOne({ email: decodedToken.email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const assessment = await Assessment.findOne({ userId: user._id }).sort({ createdAt: -1 });
    const challenges = await Challenge.find({ userId: user._id });

    return NextResponse.json({ assessment, challenges });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
