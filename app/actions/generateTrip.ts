"use server";

import { getOpenAIClient } from "../lib/openai";
import { ROUTES } from "../lib/routes";
import type { FerryTrip } from "../types/ferryTrip";
import type { FerryRequest } from "../types/types";

export async function GenerateFerryTrip(
  request: FerryRequest,
): Promise<FerryTrip> {
  const relevantRoutes = ROUTES.filter(
    (route) =>
      route.from === request.origin || route.to === request.destination,
  );

  console.log("Relevant routes:", relevantRoutes);
  const routesContext = JSON.stringify(relevantRoutes, null, 2);

  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are an AI ferry travel planner.

Only use the routes provided below. Do NOT invent new routes.

Available routes:

${routesContext}

Return ONLY valid JSON:

{
 "route": "",
 "departure_port": "",
 "arrival_port": "",
 "operator": "",
 "duration": "",
 "notes": ""
}
`,
      },
      {
        role: "user",
        content: `
Plan a ferry trip with the following details:

Origin: ${request.origin}
Destination: ${request.destination}
Trip type: ${request.tripType}
Departure date: ${request.departureDate}
Return date: ${request.returnDate}
Passengers: ${request.passengers}
`,
      },
    ],
  });

  const text = completion.choices[0].message.content;

  if (!text) throw new Error("AI returned empty response");

  return JSON.parse(text) as FerryTrip;
}
