import { useOutlet, useSearchParams } from "react-router";
import { MyList } from "../components/MyList";

export default function MyListPage() {
  const [searchParams] = useSearchParams();
  const modal = useOutlet();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-8 md:pt-28">
      {!modal && <title>My List | usePopcorn</title>}
      <MyList filter={searchParams.get("q") ?? ""} />

      {/* Details modal (/:id) */}
      {modal}
    </div>
  );
}
