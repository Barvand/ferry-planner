import OpenAI from "openai";

export async function POST(req: Request) {
  const { messages, ferryResult } = await req.json();

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const formattedResult = ferryResult
    ? `Available ferry route:
- Route: ${ferryResult.outbound.departure_port} → ${ferryResult.outbound.arrival_port}
- Date: ${ferryResult.outbound.departure_date}
- Departure: ${ferryResult.outbound.departure_time}, Arrival: ${ferryResult.outbound.arrival_time}
- Duration: ${ferryResult.outbound.duration}
- Operator: ${ferryResult.outbound.operator}
- Price: ${ferryResult.outbound.price}
${
  ferryResult.return
    ? `
Return leg:
- Route: ${ferryResult.return.departure_port} → ${ferryResult.return.arrival_port}
- Date: ${ferryResult.return.departure_date}
- Departure: ${ferryResult.return.departure_time}, Arrival: ${ferryResult.return.arrival_time}
- Price: ${ferryResult.return.price}`
    : ""
}`
    : "No ferry routes found yet.";

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a friendly ferry booking assistant for routes between Bergen, Stavanger, Kristiansand, and Hirtshals.
You help users find and understand ferry trips. Be concise but helpful.
Current ferry data: ${formattedResult}`,
      },
      ...messages, // full chat history
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable);
}
