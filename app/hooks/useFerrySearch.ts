import { useState } from "react";
import { GenerateFerryTrip } from "../actions/generateTrip";
import { FerryTrip } from "../types/ferryTrip";
import { FerryRequest } from "../types/types";

export function useFerrySearch() {
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [result, setResult] = useState<FerryTrip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const data = new FormData(e.currentTarget);
    const origin = String(data.get("origin"));
    const destination = String(data.get("destination"));

    if (origin === destination) {
      setError("Origin and destination cannot be the same.");
      return;
    }

    const request: FerryRequest = {
      tripType,
      origin,
      destination,
      departureDate: String(data.get("departureDate")),
      returnDate: tripType === "round" ? String(data.get("returnDate")) : "",
      passengers: Number(data.get("passengers")),
    };

    setLoading(true);
    try {
      const response = await GenerateFerryTrip(request);
      setResult(response);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { tripType, setTripType, result, loading, error, search };
}
