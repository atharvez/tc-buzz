export async function POST(req: Request): Promise<Response> {
  try {
    const { text } = await req.json();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `
Summarize this Terms and Conditions.

Give:
- Summary
- Risks
- Rating

Text:
${text.slice(0, 2000)}
`
        })
      }
    );

    const data = await response.json();

    const output = data?.[0]?.generated_text || "No response";

    return new Response(JSON.stringify({
      summary: output,
      risks: [],
      rating: "Unknown"
    }));

  } catch (error) {
    return new Response(JSON.stringify({
      summary: "Error",
      risks: [],
      rating: "Error"
    }));
  }
}