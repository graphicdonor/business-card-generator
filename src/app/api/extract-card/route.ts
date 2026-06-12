import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { image } = await request.json();

  const matches = image.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });

  let response;
  try {
    response = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: image, detail: "high" },
            },
            {
              type: "text",
              text: `Analyze this business card image and extract all visible text and color information. Return ONLY a valid JSON object with these exact fields (use empty string "" for any field not found or not visible):
{
  "fullName": "",
  "designation": "",
  "company": "",
  "phone": "",
  "mobile": "",
  "email": "",
  "website": "",
  "address": "",
  "linkedin": "",
  "instagram": "",
  "twitter": "",
  "primaryColor": "",
  "secondaryColor": "",
  "accentColor": "",
  "logoText": ""
}
For colors: use hex format (#RRGGBB). Extract the dominant background color as primaryColor, the main text color as secondaryColor, and any highlight/accent color as accentColor. For logoText use company initials (max 3 characters). Return ONLY the raw JSON object — no markdown fences, no explanation, nothing else.`,
            },
          ],
        },
      ],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "OpenRouter API error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const text = response.choices[0]?.message?.content ?? "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return NextResponse.json({ error: "Could not extract card data from image" }, { status: 422 });
  }

  try {
    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Extraction returned invalid data" }, { status: 422 });
  }
}
