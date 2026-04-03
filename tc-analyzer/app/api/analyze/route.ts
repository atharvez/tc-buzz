import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalyzeRequest {
  text: string;
}

interface AnalyzeResponse {
  summary: string;
  risks: string[];
  rating: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: AnalyzeRequest = await req.json();
    const { text } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Analyze this Terms and Conditions.

Return ONLY JSON:
{
  "summary": "...",
  "risks": ["...", "..."],
  "rating": "Safe | Moderate | Risky"
}

Text:
${text.slice(0, 5000)}
`;

    const result = await model.generateContent(prompt);
    const output = await result.response.text();

    let parsed: AnalyzeResponse;

    try {
      parsed = JSON.parse(output);
    } catch {
      parsed = {
        summary: output,
        risks: [],
        rating: "Unknown",
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      summary: "Error processing request",
      risks: [],
      rating: "Error"
    }), { status: 500 });
  }
}