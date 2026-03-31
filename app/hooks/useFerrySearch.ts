import { useState, useRef } from "react";
import { GenerateFerryTrip } from "../actions/generateTrip";
import { FerryTrip } from "../types/ferryTrip";
import { FerryRequest } from "../types/types";
import { SearchByQuery } from "../actions/searchByQuery";

type Message = { role: "user" | "assistant"; content: string };

async function streamFromApi(
  messages: Message[],
  ferryResult: FerryTrip | null,
  onChunk: (text: string) => void,
) {
  const res = await fetch("/api/ai-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, ferryResult }),
  });

  if (!res.body) throw new Error("Streaming not supported");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value || new Uint8Array());
    onChunk(accumulated);
  }

  return accumulated;
}

export function useFerrySearch() {
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [result, setResult] = useState<FerryTrip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"form" | "text">("form");
  const [suggestion, setSuggestion] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Helper: append an assistant placeholder and stream into it
  const streamAssistantReply = async (
    history: Message[],
    currentResult: FerryTrip | null,
  ) => {
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const finalText = await streamFromApi(history, currentResult, (text) => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: text };
        return updated;
      });
    });

    return finalText;
  };

  const search = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSuggestion(false);
    setMessages([]);

    const data = new FormData(e.currentTarget);

    try {
      setLoading(true);

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
          returnDate:
            tripType === "round" ? String(data.get("returnDate")) : "",
          passengers: Number(data.get("passengers")),
        };
        const response = await GenerateFerryTrip(request);
        setResult(response);
      }

      if (mode === "text") {
        const query = String(data.get("query"));
        const userMessage: Message = { role: "user", content: query };

        // Fetch ferry data first
        const response = await SearchByQuery(query);
        if (!response.success) {
          setError(response.error);
          return;
        }
        setSuggestion(response.suggestion ?? false);
        const newResult: FerryTrip = {
          outbound: response.leg,
          return: response.returnLeg ?? null,
        };
        setResult(newResult);

        // Now stream AI reply with the fresh result
        const history = [userMessage];
        setMessages(history);
        await streamAssistantReply(history, newResult);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Follow-up chat after initial search
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);

    try {
      setLoading(true);
      await streamAssistantReply(updatedHistory, result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
    sendMessage,
    suggestion,
    messages,
  };
}
