import { NextRequest, NextResponse } from "next/server";
import { generateGeminiResponse } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { company } = body;

  if (!company || typeof company !== "string" || company.trim().length === 0) {
    return NextResponse.json(
      { error: "Company name is required." },
      { status: 400 }
    );
  }

  const prompt = `
You are a professional investment research analyst.

Analyze the company "${company.trim()}" and respond ONLY with a valid JSON object, no markdown formatting, no extra text, in this exact structure:

{
  "company": "${company.trim()}",
  "summary": "2-3 sentence overview of the company",
  "strengths": ["point 1", "point 2", "point 3"],
  "weaknesses": ["point 1", "point 2", "point 3"],
  "opportunities": ["point 1", "point 2", "point 3"],
  "risks": ["point 1", "point 2", "point 3"],
  "decision": "INVEST or PASS",
  "confidence": a number from 0 to 100,
  "reasoning": "2-3 sentence explanation of the decision"
}
  `.trim();

  try {
    const raw = await generateGeminiResponse(prompt);

    // Gemini sometimes wraps JSON in markdown code fences — strip them
    const clean = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Analyze route error:", err);
    return NextResponse.json(
      { error: "Failed to analyze company. Please try again." },
      { status: 500 }
    );
  }
}