import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <h1>Margarita</h1>
      <p>A study in real-time UI.</p>
    </main>
  );
}
