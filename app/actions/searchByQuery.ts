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
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: `Extract ferry trip details from the user's message. Return JSON only:
{
  "origin": "",
  "destination": "",
  "date": "",
  "isReturn": false,
  "returnDate": ""
}
Only use these exact port names: Bergen, Stavanger, Kristiansand, Hirtshals.
Be generous with matching — "Hirsberg", "Hirthal", "Hirshals" → "Hirtshals".
"Christiansand", "Kristiansund" → "Kristiansand".
If the user mentions a direction or nearby city, infer the closest port.
For date, return ISO format YYYY-MM-DD. Today is ${new Date().toISOString().split("T")[0]}.
If no date is mentioned, use today's date.
If no origin is mentioned, leave it empty.
Set isReturn to true if the user mentions "return", "round trip", "back", "both ways".
If isReturn is true and a return date is mentioned, fill returnDate, otherwise leave it empty.`,
      },
      { role: "user", content: query },
    ],
  });

  const text = extraction.choices[0].message.content ?? "";
  const clean = text.replace(/```json|```/g, "").trim();
  const { origin, destination, date, isReturn, returnDate } = JSON.parse(clean);

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
