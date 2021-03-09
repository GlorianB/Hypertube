import React, { useState } from "react";
import { TextField, Container, Grid, Button } from "@material-ui/core";
import "./EditPassword.scss";
import "../../assets/Style.scss";
import axios from "axios";
import SimpleSnackbar from "../SnackBar/SnackBar";

export const EditPassword = () => {
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    status: "",
  });

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("user/editPassword", password).then((res) => {
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
    <Container className="editPassword__body">
      <form onSubmit={handleSubmit}>
        <h3>Edit password</h3>
        <Grid container spacing={5} className="custom__form" style={{ marginTop: "20px" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="oldPassword"
              value={password.oldPassword || ""}
              onChange={handleChange}
              label="Please enter your old password"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="newPassword"
              value={password.newPassword || ""}
              onChange={handleChange}
              label="Please enter your new password"
              helperText="Must contain 8 characters, 1 letter, 1 number and 1 special character"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="confirmNewPassword"
              value={password.confirmNewPassword || ""}
              onChange={handleChange}
              label="Please confirm your new password"
              variant="outlined"
              required
            />
          </Grid>
        </Grid>
        <Button className="custom__btn font-size-20" type="submit">
          Edit password
        </Button>
      </form>
      {alert.open && (
        <SimpleSnackbar key={alert.date} message={alert.message} status={alert.status} teste={alert.open} />
      )}
    </Container>
  );
};

export default EditPassword;
