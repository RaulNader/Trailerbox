import { useEffect, useRef, useState } from "react";

// Flips to true once the element scrolls near the viewport, then stays true.
// Lets the home page fetch each catalog row only when it is about to be seen.
export function useInView<T extends Element = HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(
    typeof IntersectionObserver === "undefined"
  );

  useEffect(
    function () {
      if (inView || !ref.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          setInView(true);
          observer.disconnect();
        },
        { rootMargin }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    },
    [inView, rootMargin]
  );

  return [ref, inView] as const;
}
