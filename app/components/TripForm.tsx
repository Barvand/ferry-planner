"use client";

import { useState } from "react";
import { GenerateFerryTrip } from "../actions/generateTrip";
import type { FerryTrip } from "../types/ferryTrip";
import type { FerryRequest } from "../types/types";

const PORTS = ["Bergen", "Stavanger", "Kristiansand", "Hirtshals"];

export default function TripForm() {
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [result, setResult] = useState<FerryTrip | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const request: FerryRequest = {
      tripType,
      origin: String(data.get("origin")),
      destination: String(data.get("destination")),
      departureDate: String(data.get("departureDate")),
      returnDate: tripType === "round" ? String(data.get("returnDate")) : "",
      passengers: Number(data.get("passengers")),
    };

    setLoading(true);

    try {
      const response = await GenerateFerryTrip(request);
      setResult(response);
    } catch (error) {
      console.error("Trip generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 max-w-md mx-auto text-black"
    >
      {/* Trip type */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`flex-1 p-3 rounded-xl border font-medium ${
            tripType === "round"
              ? "bg-black text-white"
              : "bg-white text-black border-gray-300"
          }`}
          onClick={() => setTripType("round")}
        >
          Round trip
        </button>

        <button
          type="button"
          className={`flex-1 p-3 rounded-xl border font-medium ${
            tripType === "oneway"
              ? "bg-black text-white"
              : "bg-white text-black border-gray-300"
          }`}
          onClick={() => setTripType("oneway")}
        >
          One way
        </button>
      </div>

      {/* Route */}
      <div className="flex gap-2">
        <select
          name="origin"
          required
          className="flex-1 p-3 rounded-xl border border-gray-300 bg-white"
        >
          <option value="">From</option>
          {PORTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          name="destination"
          required
          className="flex-1 p-3 rounded-xl border border-gray-300 bg-white"
        >
          <option value="">To</option>
          {PORTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="flex gap-2">
        <input
          type="date"
          name="departureDate"
          required
          className="flex-1 p-3 rounded-xl border border-gray-300 bg-white"
        />

        {tripType === "round" && (
          <input
            type="date"
            name="returnDate"
            required
            className="flex-1 p-3 rounded-xl border border-gray-300 bg-white"
          />
        )}
      </div>

      {/* Passengers */}
      <input
        type="number"
        name="passengers"
        defaultValue={1}
        min={1}
        className="p-3 rounded-xl border border-gray-300 bg-white w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 rounded-xl bg-black text-white font-medium disabled:opacity-50"
      >
        {loading ? "Searching…" : "Search"}
      </button>

      {result && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </form>
  );
}
