import React from "react";
import history from "../../history";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
export default function NavButtons() {
  const MySwal = withReactContent(Swal);

  return (
    <div>
      <button
        className="lost__links"
        onClick={async (e) => {
          history.replace("/leaderboards");
          window.location.reload();
          MySwal.close();
        }}
      >
        Leaderboards
      </button>
      <button
        className="lost__links"
        onClick={async (e) => {
          MySwal.close();
          window.location.reload();
        }}
      >
        Start over
      </button>
    </div>
  );
}
