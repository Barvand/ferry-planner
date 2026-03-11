import { useState } from "react";
import { GenerateFerryTrip } from "../actions/generateTrip";
import { FerryTrip } from "../types/ferryTrip";
import { FerryRequest } from "../types/types";
import { SearchByQuery } from "../actions/searchByQuery";

export function useFerrySearch() {
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [result, setResult] = useState<FerryTrip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"form" | "text">("form");
  const [suggestion, setSuggestion] = useState(false); // new state for AI suggestions

  const search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSuggestion(false);

    const data = new FormData(e.currentTarget);

    if (mode === "form") {
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
    }

    if (mode === "text") {
      const query = String(data.get("query"));
      setLoading(true);
      try {
        const response = await SearchByQuery(query);
        if (!response.success) {
          setError(response.error);
          return;
        }
        setSuggestion(response.suggestion ?? false);
        setResult({
          outbound: response.leg,
          return: response.returnLeg ?? null,
        });
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    mode,
    setMode,
    tripType,
    setTripType,
    result,
    loading,
    error,
    search,
    suggestion,
  };
}
