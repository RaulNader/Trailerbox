import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { EmptyState } from "../components/Status";

export default function ErrorPage() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error";

  return (
    <div className="px-4 pt-32">
      <title>Something went wrong | usePopcorn</title>
      <EmptyState icon="💥" title="Something went wrong">
        {message}
      </EmptyState>
      <div className="flex justify-center">
        <Link to="/movies" reloadDocument className="btn-brand">
          Reload usePopcorn
        </Link>
      </div>
    </div>
  );
}
