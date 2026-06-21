import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { GoogleGenAI } from "@google/genai";
import dbConnect from "@/lib/mongodb";
import ReceiptAnalysis from "@/models/ReceiptAnalysis";
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

    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const prompt = `Analyze this grocery receipt. Identify purchased food items, estimate environmental impact level, determine the highest carbon-impact item, and suggest a practical lower-impact alternative. Return valid JSON only.
Expected JSON:
{
  "estimated_food_impact": "High",
  "highest_offender": "Beef",
  "reason": "High greenhouse gas emissions during production",
  "eco_alternative": "Chicken or lentils"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { inlineData: { data: imageBase64, mimeType } },
        prompt
      ],
      config: { responseMimeType: "application/json" }
    });

    const aiResult = JSON.parse(response.text || "{}");

    const analysis = await ReceiptAnalysis.create({
      userId: user._id,
      estimatedFoodImpact: aiResult.estimated_food_impact || "Unknown",
      highestOffender: aiResult.highest_offender || "Unknown",
      reason: aiResult.reason || "Unknown",
      ecoAlternative: aiResult.eco_alternative || "Unknown",
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Receipt error:", error);
    return NextResponse.json({ error: "Failed to process receipt" }, { status: 500 });
  }
}
