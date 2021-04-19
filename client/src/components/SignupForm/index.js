import React from "react";
import Form from "./Form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function SignupForm() {
  const MySwal = withReactContent(Swal);

  MySwal.fire({
    title: <Form />,
    footer: "Be one of the greats.",
    confirmButtonText: "Get started",
    didOpen: () => {
      // `MySwal` is a subclass of `Swal`
      //   with all the same instance & static methods
      //   MySwal.clickConfirm();
    },
  }).then(() => {
    return MySwal.fire(<p>Shorthand works too</p>);
  });

  return <div></div>;
}
