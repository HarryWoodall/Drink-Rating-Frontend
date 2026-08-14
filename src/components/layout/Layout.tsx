import { Outlet } from "react-router-dom";
import { Banner } from "./Banner/Banner";

export function Layout() {
  return (
    <div className="min-h-screen">
      <Banner />

      <main className="mx-auto max-w-6xl px-7">
        <Outlet />
      </main>

      <footer className="mx-auto mt-16 max-w-6xl px-7 pb-16 pt-10 text-center">
        <div className="mb-2 font-serif text-lg italic text-amber">
          Drink curiously.
        </div>
        <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Nightcap — a community cocktail index · please sip responsibly
        </p>
      </footer>
    </div>
  );
}
