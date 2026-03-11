import TripForm from "./components/TripForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        {/* Hero */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            AI-powered ferry search
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-none">
            Find your <br />
            <span className="text-slate-400">next crossing.</span>
          </h1>
          <p className="text-slate-500 text-base max-w-md">
            Tell us where you want to go and we'll find the best ferry
            connection for you.
          </p>
        </div>

        <TripForm />
      </main>
    </div>
  );
}
