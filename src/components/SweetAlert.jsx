// src/components/SweetAlert.js
import Swal from "sweetalert2";

export const showAlert = ({
  type = "info",
  title = "",
  text = "",
  timer = 1500,
  showConfirmButton = false,
}) => {
  return Swal.fire({
    icon: type,
    title,
    text,
    timer,
    showConfirmButton,
  });
};
