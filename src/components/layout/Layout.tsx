import { Outlet } from "react-router-dom";
import { Banner } from "./Banner/Banner";

export function Layout() {
  return (
    <div className="min-h-screen">
      <Banner />

      <main className="mx-auto max-w-6xl px-7 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
