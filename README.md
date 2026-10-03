# usePopcorn

Netflix-style movie and series browser built with React 19, TypeScript, Vite, React Router v7 and Tailwind CSS, using the [OMDb API](https://www.omdbapi.com/) for search and title details.

Genre catalogs come from [Cinemeta](https://v3-cinemeta.strem.io/manifest.json), Stremio's official catalog addon (no key needed). `/movies` and `/series` show one row per genre. Each row's "See all" opens the full catalog at `/movies/popular` or `/movies/genre/:genre`.

## Setup

1. Install dependencies: `npm install`
2. Get a free OMDb API key at https://www.omdbapi.com/apikey.aspx
3. Copy `.env.example` to `.env` and set `VITE_OMDB_KEY`
4. Start the app: `npm run dev` (http://localhost:3000)

`.env` is git-ignored. Note that Vite embeds `VITE_*` variables in the built JavaScript, so the key is still visible to anyone using a deployed build.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the `dist/` build locally |
| `npm test` | Vitest in watch mode (`npx vitest run` for one pass) |
| `npm run typecheck` | `tsc -b` only |
| `npm run lint` | ESLint |
