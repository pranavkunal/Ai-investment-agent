import { GoogleGenerativeAI } from "@google/generative-ai";

// Read the API key from environment variables (never hardcode it)
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env.local");
}

// Create one shared client instance
const genAI = new GoogleGenerativeAI(apiKey);

// Reusable function — takes a prompt string, returns the model's text response
export async function generateGeminiResponse(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate response from Gemini.");
  }
}