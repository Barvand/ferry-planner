# FerryFinder

AI-powered ferry search built as a demo project.

## What it does

Search for ferry connections between Norwegian and Danish ports.
Enter your route, dates and passengers — an AI model finds and
returns a realistic trip suggestion.

## Tech stack

- **Next.js 14** — App Router, Server Actions
- **OpenAI GPT-4.1-mini** — trip generation
- **Tailwind CSS** — styling
- **TypeScript** — fully typed

## Architecture decisions

- **Server Action** for the AI call — keeps the API key server-side, never exposed to the client
- **Custom hook** (`useFerrySearch`) — separates form state and logic from UI
- **FormData over controlled inputs** — reduces unnecessary state, reads values on submit
- **Typed response** (`FerryLeg` / `FerryTrip`) — ensures the AI response matches the expected shape

## Known limitations

- Trip data is AI-generated, not pulled from a live booking system
- Routes are limited to Bergen, Stavanger, Kristiansand and Hirtshals

## Running locally

1. Clone the repo
2. Install dependencies — `npm install`
3. Add your OpenAI key to `.env.local`:
   OPENAI_API_KEY=sk-...
4. `npm run dev`
