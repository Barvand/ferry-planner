import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages, ferryResult } = await req.json();

  if (!Array.isArray(messages)) {
    return new Response("Invalid request: messages must be an array", { status: 400 });
  }

  const formattedResult = ferryResult
    ? `Available ferry route:
- Route: ${ferryResult.outbound.departure_port} → ${ferryResult.outbound.arrival_port}
- Date: ${ferryResult.outbound.departure_date}
- Departure: ${ferryResult.outbound.departure_time}, Arrival: ${ferryResult.outbound.arrival_time}
- Duration: ${ferryResult.outbound.duration}
- Operator: ${ferryResult.outbound.operator}
- Price: ${ferryResult.outbound.price}${
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

  try {
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
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("OpenAI stream error:", err);
    return new Response("Failed to generate response", { status: 500 });
  }
}
