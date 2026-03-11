"use client";
import { useState } from "react";

const PORTS = [
  "Bergen",
  "Stavanger",
  "Oslo",
  "Kristiansand",
  "Trondheim",
  "Ålesund",
];

function TripForm() {
  const [tripType, setTripType] = useState("round");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = {
      tripType,
      origin: data.get("origin"),
      destination: data.get("destination"),
      departureDate: data.get("departureDate"),
      returnDate: data.get("returnDate"),
      passengers: data.get("passengers"),
    };
    setLoading(true);
    // const response = await fetch("https://api.anthropic.com/v1/messages", {formData});   {
    //   // ...your existing fetch config using formData

    //   // setResult(response)
    // });
    // ...handle response
    setLoading(false);
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
          className={`flex-1 p-3 rounded-xl border font-medium ${tripType === "round" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
          onClick={() => setTripType("round")}
        >
          Round trip
        </button>
        <button
          type="button"
          className={`flex-1 p-3 rounded-xl border font-medium ${tripType === "oneway" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
          onClick={() => setTripType("oneway")}
        >
          One way
        </button>
      </div>

      {/* Route */}
      <div className="flex gap-2">
        <select
          name="origin"
          className="flex-1 p-3 rounded-xl border border-gray-300 bg-white"
        >
          <option value="">From</option>
          {PORTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          name="destination"
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
          className="flex-1 p-3 rounded-xl border border-gray-300 bg-white"
        />
        {tripType === "round" && (
          <input
            type="date"
            name="returnDate"
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
          {result}
        </div>
      )}
    </form>
  );
}

export default TripForm;
