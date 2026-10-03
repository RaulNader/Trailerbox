import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { MovieModal } from "../components/MovieModal";

export default function TitleModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const openedInApp = location.state?.modal === true;

  const handleClose = useCallback(
    function () {
      // Opened from a card: step back so the browser Back button stays in sync.
      // Opened from a shared link: there is nothing to go back to, so go to the parent page.
      if (openedInApp) navigate(-1);
      else
        navigate(
          { pathname: "..", search: location.search },
          { replace: true, preventScrollReset: true }
        );
    },
    [openedInApp, navigate, location.search]
  );

  return <MovieModal key={id} selectedId={id} onClose={handleClose} />;
}
