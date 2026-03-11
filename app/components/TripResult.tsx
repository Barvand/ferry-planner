import { FerryLeg } from "../types/ferryTrip";
import { formatDate } from "../lib/utils";

function TripResult({ leg }: { leg: FerryLeg }) {
  return (
    <div className="mx-auto mt-6 space-y-4 text-black max-w-6xl">
      <h2 className="text-2xl font-bold">
        Departure from {leg.departure_port}
      </h2>
      <p className="text-sm text-gray-500">{formatDate(leg.departure_date)}</p>
      <div className="flex items-center gap-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex-1 flex items-center justify-between px-6 py-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase">
              {leg.departure_port}
            </p>
            <p>{leg.departure_time}</p>
          </div>
          <div className="flex flex-col items-center text-gray-400 text-xs">
            <span>{leg.duration}</span>
            <div className="w-24 h-px bg-gray-300 my-1" />
            <span>{leg.operator}</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase">
              {leg.arrival_port}
            </p>
            <p>{leg.arrival_time}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-6 border-l border-gray-200 gap-3 py-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase">Ticket price</p>
            <p className="text-2xl font-bold">{leg.price}</p>
          </div>
          <button className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-lg w-full">
            Select
          </button>
        </div>
      </div>
      {leg.notes && (
        <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
          ⓘ {leg.notes}
        </p>
      )}
    </div>
  );
}

export default TripResult;
