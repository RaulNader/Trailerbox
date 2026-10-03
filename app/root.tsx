import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="border-b border-zinc-800">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <Link to="/" className="text-xl font-black text-brand">
              MovieBox
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const title = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText || "Error"}`
    : "Something went wrong";

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <Link to="/" className="mt-4 inline-block text-brand underline">
        Back to movies
      </Link>
    </div>
  );
}
