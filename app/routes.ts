import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("movies/:movieId", "routes/movie.tsx"),
] satisfies RouteConfig;
