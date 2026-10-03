import { Outlet, useSearchParams } from "react-router";
import { MyList } from "../components/MyList";

export default function MyListPage() {
  const [searchParams] = useSearchParams();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-8 md:pt-28">
      <MyList filter={searchParams.get("q") ?? ""} />

      {/* Details modal (/:id) */}
      <Outlet />
    </div>
  );
}
