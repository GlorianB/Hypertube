import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export default function SimpleSnackbar({ status, message }) {
  const [open, setOpen] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <MuiAlert
          style={{ fontSize: "24px", fontWeight: "400" }}
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={status}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
