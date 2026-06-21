import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { GoogleGenAI } from "@google/genai";
import dbConnect from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import Challenge from "@/models/Challenge";
import User from "@/models/User";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    await dbConnect();
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const assessment = await Assessment.findOne({ userId: user._id }).sort({ createdAt: -1 });

    const prompt = `You are a climate coach. The user's top emission source is ${assessment?.topEmissionSource || 'general'}. 
Generate ONE realistic, specific, and measurable sustainability challenge for them to complete this week.
Respond ONLY with a valid JSON object matching this exact structure:
{
  "title": "Short title of the challenge",
  "description": "A 1-2 sentence description of what to do and why it helps.",
  "difficulty": "Easy" // or "Medium", "Hard",
  "impact": "Medium" // or "Low", "High"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const aiResult = JSON.parse(response.text || "{}");

    const challenge = await Challenge.create({
      userId: user._id,
      title: aiResult.title || "Go Meatless for a Day",
      description: aiResult.description || "Try avoiding meat for one full day to reduce greenhouse gas emissions.",
      difficulty: aiResult.difficulty || "Easy",
      impact: aiResult.impact || "Medium",
      status: "accepted"
    });

    return NextResponse.json({ success: true, challenge });
  } catch (error) {
    console.error("Challenge Gen Error:", error);
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 });
  }
}
