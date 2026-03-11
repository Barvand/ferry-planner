"use server";
import { getOpenAIClient } from "../lib/openai";
import type { FerryTrip } from "../types/ferryTrip";
import type { FerryRequest } from "../types/types";

export async function GenerateFerryTrip(
  request: FerryRequest,
): Promise<FerryTrip> {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `You are a ferry travel assistant. Return valid JSON only, no markdown:
{
  "outbound": {
    "departure_port": "", "arrival_port": "", "departure_date": "",
    "departure_time": "", "arrival_time": "", "duration": "", "operator": "", "price": "", "notes": ""
  },
  "return": null
}
For round trips, fill in the return leg. For one way, set return to null.`,
      },
      {
        role: "user",
        content: `Find a ${request.tripType === "round" ? "round trip" : "one way"} ferry from ${request.origin} to ${request.destination} on ${request.departureDate} for ${request.passengers} passenger(s).${request.tripType === "round" ? ` Return date: ${request.returnDate}.` : ""}`,
      },
    ],
  });

  const text = completion.choices[0].message.content ?? "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as FerryTrip;
}
