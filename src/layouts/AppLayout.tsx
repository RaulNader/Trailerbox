import { Outlet, ScrollRestoration } from "react-router";
import { NavBar } from "../components/NavBar";

export default function AppLayout() {
  return (
    <>
      <ScrollRestoration />
      <NavBar />

      <main className="pb-20">
        <Outlet />
      </main>

      <footer className="border-t border-fg/5 py-8 text-center text-sm text-neutral-500">
        Data from OMDb and Cinemeta
        <span className="hidden md:inline">
          {" "}· Press <kbd className="rounded bg-fg/10 px-1.5">Enter</kbd> to search,{" "}
          <kbd className="rounded bg-fg/10 px-1.5">Esc</kbd> to close
        </span>
      </footer>
    </>
  );
}
