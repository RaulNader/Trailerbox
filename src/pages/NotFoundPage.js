import { Link } from "react-router";
import { EmptyState } from "../components/Status";

export default function NotFoundPage() {
  return (
    <div className="px-4 pt-32">
      <EmptyState icon="🎞️" title="Lost your way?">
        This page doesn't exist.
      </EmptyState>
      <div className="flex justify-center">
        <Link to="/movies" className="btn-brand">
          Back to Movies
        </Link>
      </div>
    </div>
  );
}
