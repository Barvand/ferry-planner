import TripForm from "./components/TripForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex w-full flex-col items-center justify-center gap-6 px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
          Enter your trip here.
        </h1>
        <TripForm />
      </main>
    </div>
  );
}
