import { Header } from "./Header";
import { NavItems } from "./NavItems";

export function Banner() {
  return (
    <div className="mx-auto max-w-6xl px-7">
      <nav className="flex items-center justify-between py-7">
        <Header />
        <NavItems />
      </nav>
    </div>
  );
}
