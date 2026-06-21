import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { GoogleGenAI } from "@google/genai";
import dbConnect from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import ChatMessage from "@/models/ChatMessage";
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
    const { message, history } = body;

    const assessment = await Assessment.findOne({ userId: user._id }).sort({ createdAt: -1 });

    await ChatMessage.create({ userId: user._id, role: "user", content: message });

    const systemInstruction = `You are GreenMind AI, a practical and encouraging climate coach. 
Use the user's profile to personalize all responses. Keep answers concise, actionable, and under three sentences. Focus on realistic lifestyle improvements.
User Profile: Top Emission Source: ${assessment?.topEmissionSource || "Unknown"}, Diet: ${assessment?.diet || "Unknown"}, Transport: ${assessment?.transport || "Unknown"}`;

    let fullPrompt = systemInstruction + "\n\nChat History:\n";
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        fullPrompt += `${msg.role === 'user' ? 'User' : 'GreenMind'}: ${msg.content}\n`;
      }
    }
    fullPrompt += `User: ${message}\nGreenMind:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const reply = response.text || "I'm sorry, I couldn't process that right now.";

    await ChatMessage.create({ userId: user._id, role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
