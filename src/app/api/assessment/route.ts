import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { GoogleGenAI } from '@google/genai';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import User from '@/models/User';

import { AssessmentSchema } from '@/lib/validations';

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

    const rawBody = await req.json();
    
    // Zod Validation
    const validation = AssessmentSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }
    const body = validation.data;
    
    const prompt = `You are an expert environmental analyst. Analyze the user's lifestyle profile and estimate a directional carbon score from 1 to 100 (where 100 is excellent/lowest emissions and 1 is terrible/highest emissions). Identify the largest contributor to emissions. Provide practical, realistic recommendations. Return only valid JSON.
    
User Profile:
- Transport: ${body.transport}
- Diet: ${body.diet}
- Online Shopping: ${body.shopping}
- Household Size: ${body.household}
- Electricity Usage: ${body.electricity}

Response schema exactly like this:
{
  "carbon_score": 72,
  "risk_level": "Moderate",
  "top_emission_source": "Transport",
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const aiResult = JSON.parse(text);

    const assessment = await Assessment.create({
      userId: user._id,
      transport: body.transport,
      diet: body.diet,
      shopping: body.shopping,
      household: body.household,
      electricity: body.electricity,
      carbonScore: aiResult.carbon_score,
      riskLevel: aiResult.risk_level,
      topEmissionSource: aiResult.top_emission_source,
      recommendations: aiResult.recommendations,
    });

    await User.findByIdAndUpdate(user._id, { onboardingCompleted: true });

    return NextResponse.json({ success: true, assessment });
  } catch (error) {
    console.error('Assessment error:', error);
    return NextResponse.json({ error: 'Failed to process assessment' }, { status: 500 });
  }
}
