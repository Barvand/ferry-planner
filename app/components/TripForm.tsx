"use client";
import { useFerrySearch } from "../hooks/useFerrySearch";
import TripResult from "./TripResult";

const PORTS = ["Bergen", "Stavanger", "Kristiansand", "Hirtshals"];

export default function TripForm() {
  const { tripType, setTripType, result, loading, error, search } =
    useFerrySearch();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-8">
        <form onSubmit={search} className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Trip type */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setTripType("round")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${tripType === "round" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                ⇄ Round trip
              </button>
              <button
                type="button"
                onClick={() => setTripType("oneway")}
                className={`flex-1 py-4 text-sm font-medium transition-colors border-l border-slate-200 ${tripType === "oneway" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                → One way
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Route */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    From
                  </label>
                  <select
                    name="origin"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Select port</option>
                    {PORTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    To
                  </label>
                  <select
                    name="destination"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Select port</option>
                    {PORTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div
                className={`grid gap-3 ${tripType === "round" ? "grid-cols-2" : "grid-cols-1"}`}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Departure
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                {tripType === "round" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Return
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Passengers
                </label>
                <input
                  type="number"
                  name="passengers"
                  defaultValue={1}
                  min={1}
                  max={20}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Finding trips…
                  </span>
                ) : (
                  "Search trips"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              {result.return ? "Your options" : "Your option"}
            </h2>
            <TripResult leg={result.outbound} />
            {result.return && <TripResult leg={result.return} />}
          </div>
        )}
      </div>
    </div>
  );
}
