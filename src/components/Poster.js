import { useState } from "react";
import { hasValue } from "../utils";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="#1f1f1f"/><text x="100" y="165" font-size="64" text-anchor="middle">🎬</text></svg>'
  );

// OMDb returns "N/A" or dead links for some posters
export default function Poster({ src, title, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={hasValue(src) && !failed ? src : FALLBACK}
      alt={`Poster of ${title}`}
      onError={() => setFailed(true)}
      loading="lazy"
      className={className}
    />
  );
}
