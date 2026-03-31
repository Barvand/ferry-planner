"use server";
import { getOpenAIClient } from "../lib/openai";
import { TRIPS } from "../lib/trips";
import type { FerryLeg } from "../types/ferryTrip";

const VALID_PORTS = ["Bergen", "Stavanger", "Kristiansand", "Hirtshals"];

function mapToLeg(trip: (typeof TRIPS)[0], date: string): FerryLeg {
  return {
    departure_port: trip.from,
    arrival_port: trip.to,
    departure_date: date,
    departure_time: trip.departure_time,
    arrival_time: trip.arrival_time,
    duration: trip.duration,
    operator: trip.operator,
    price: trip.price,
  };
}

function findNextAvailableDate(
  trip: (typeof TRIPS)[0],
  fromDate: string,
): string {
  const start = new Date(fromDate + "Z");
  for (let i = 0; i <= 7; i++) {
    const candidate = new Date(start);
    candidate.setDate(start.getDate() + i);
    const day = candidate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    if (trip.days.includes(day)) {
      return candidate.toISOString().split("T")[0];
    }
  }
  return fromDate;
}

type SearchResult =
  | { success: true; leg: FerryLeg; returnLeg?: FerryLeg; suggestion?: boolean }
  | { success: false; error: string };

export async function SearchByQuery(query: string): Promise<SearchResult> {
  const client = getOpenAIClient();

  const extraction = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
Extract ferry search data from the user query.

IMPORTANT RULES:
- destination MUST be one of: Bergen, Stavanger, Kristiansand, Hirtshals
- If user says "Denmark", map it to "Hirtshals"
- If origin is missing, return null
- Always return valid JSON
- NEVER return text outside JSON

Format:
{
  "origin": string | null,
  "destination": string,
  "date": string | null,
  "isReturn": boolean,
  "returnDate": string | null
}
`,
      },
      {
        role: "user",
        content: query,
      },
    ],
  });

  const text = extraction.choices[0].message.content ?? "";

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      success: false,
      error: "Could not understand your request. Try rephrasing.",
    };
  }

  const { origin, destination, date, isReturn, returnDate } = parsed;
  const validOrigin = VALID_PORTS.find(
    (p) => p.toLowerCase() === origin?.toLowerCase(),
  );
  const validDestination = VALID_PORTS.find(
    (p) => p.toLowerCase() === destination?.toLowerCase(),
  );

  if (!validDestination) {
    return {
      success: false,
      error:
        "Could not identify a destination port. Try mentioning a port like Bergen, Stavanger, Kristiansand or Hirtshals.",
    };
  }

  // Find outbound trip
  const routeTrip = TRIPS.find(
    (t) =>
      (!validOrigin || t.from === validOrigin) && t.to === validDestination,
  );

  if (!routeTrip) {
    return {
      success: false,
      error: `No routes found to ${validDestination}${validOrigin ? ` from ${validOrigin}` : ""}.`,
    };
  }

  // Find nearest available outbound date
  const searchDate = date || new Date().toISOString().split("T")[0];
  const requestedDay = new Date(searchDate + "Z")
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const isExactDay = routeTrip.days.includes(requestedDay);
  const availableDate = isExactDay
    ? searchDate
    : findNextAvailableDate(routeTrip, searchDate);

  // If return trip requested, find the reverse leg
  if (isReturn) {
    const returnTrip = TRIPS.find(
      (t) =>
        t.from === validDestination && t.to === (validOrigin || routeTrip.from),
    );

    if (returnTrip) {
      // Return date defaults to day after outbound if not specified
      const returnSearchDate = returnDate || availableDate;
      const returnAvailableDate = findNextAvailableDate(
        returnTrip,
        returnSearchDate,
      );

      return {
        success: true,
        suggestion: !isExactDay,
        leg: mapToLeg(routeTrip, availableDate),
        returnLeg: mapToLeg(returnTrip, returnAvailableDate),
      };
    }
  }

  return {
    success: true,
    suggestion: !isExactDay,
    leg: mapToLeg(routeTrip, availableDate),
  };
}
