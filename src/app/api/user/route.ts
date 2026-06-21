import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import dbConnect from "@/lib/mongodb";
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

    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      user = await User.create({
        email: decodedToken.email,
        name: decodedToken.name,
        image: decodedToken.picture,
        onboardingCompleted: false,
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth error", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
