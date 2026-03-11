import Link from "next/link";

const decisions = [
  {
    title: "Server Actions over API routes",
    description:
      "Keeps the OpenAI API key server-side only, never exposed to the client bundle.",
  },
  {
    title: "FormData over controlled inputs",
    description:
      "Reduces unnecessary state — values are read once on submit rather than on every keystroke.",
  },
  {
    title: "Custom hook for search logic",
    description:
      "useFerrySearch separates state and logic from the UI, making TripForm a pure presentational component.",
  },
  {
    title: "AI for intent extraction only",
    description:
      "The AI parses natural language into structured data. Actual trip results come from mock data — mirroring how a real app would use a database.",
  },
  {
    title: "Fallback to nearest available date",
    description:
      "If no trip exists on the requested date, the app walks forward up to 7 days to find the next available departure rather than returning nothing.",
  },
];

export default function TripPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        {/* Hero */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600">
            Booking confirmed
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-none">
            Thank you <span className="text-slate-400">for booking.</span>
          </h1>
          <p className="text-slate-500 text-base max-w-md">
            Your ferry booking has been received. Below is an overview of the
            technical decisions made in building this demo.
          </p>
        </div>

        {/* Decisions card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              About this demo
            </p>
          </div>

          <div className="p-6 space-y-1 text-sm text-slate-600 leading-relaxed border-b border-slate-200">
            This app was built as a job application demo using Next.js,
            TypeScript, and OpenAI. It features two search modes — a structured
            form and an AI-powered natural language search.
          </div>

          <div className="px-6 py-4 border-b border-slate-200">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Decisions made
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {decisions.map((item) => (
              <div key={item.title} className="px-6 py-4 space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {item.title}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="inline-block text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to search
        </Link>
      </div>
    </div>
  );
}
