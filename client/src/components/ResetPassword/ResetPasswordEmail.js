import React, { useState } from "react";
import { TextField, Container, Grid, Button } from "@material-ui/core";
import { LockOpen } from "@material-ui/icons";
import "./ResetPassword.scss";
import "../../assets/Style.scss";
import axios from "axios";
import SimpleSnackbar from "../SnackBar/SnackBar";

export const ResetPasswordEmail = () => {
  const [userEmail, setUserEmail] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    status: "",
  });

  const handleChange = (e) => {
    setUserEmail({
      ...userEmail,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("user/resetPasswordEmail", userEmail).then((res) => {
      if (res.data.status === "error") {
        setAlert({
          open: true,
          message: res.data.message,
          status: "error",
          date: new Date(),
        });
      } else if (res.data.status === "success") {
        setAlert({
          open: true,
          message: res.data.message,
          status: "success",
          date: new Date(),
        });
      }
    });
  };
  return (
    <Container className="resetPassword__body">
      <div id="background">
        <img src="img/homepage.jpg" alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <h3>Reset your password</h3>
        <div className="resetPassword__logo">
          <LockOpen />
        </div>
        <Grid container spacing={5} className="custom__form">
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="email"
              value={userEmail.email || ""}
              onChange={handleChange}
              label="Please enter your adress email"
              variant="outlined"
              required
            />
          </Grid>
        </Grid>

        <Button className="custom__btn font-size-20" type="submit">
          Reset password
        </Button>
      </form>
      {alert.open && (
        <SimpleSnackbar key={alert.date} message={alert.message} status={alert.status} teste={alert.open} />
      )}
    </Container>
  );
};

export default ResetPasswordEmail;
