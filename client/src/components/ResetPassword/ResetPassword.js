import React, { useState, useEffect } from "react";
import { TextField, Container, Grid, Button, InputAdornment, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "axios";
import "./ResetPassword.scss";
import "../../assets/Style.scss";
import { useLocation, useHistory } from "react-router-dom";
import SimpleSnackbar from "../SnackBar/SnackBar";

export const ResetPassword = () => {
  const url = useLocation();
  const history = useHistory();

  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    status: "",
  });

  const [password, setPassword] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });

  useEffect(() => {
    if (url.search) {
      const urlEmail = url.search.split("&")[0].split("=")[0].split("?")[1];
      const urlToken = url.search.split("&")[1].split("=")[0];

      //CHECK IF URL CONTAINS EMAIL AND TOKEN, IF NOT REDIRECT TO "/"
      if (urlEmail === "email" && urlToken === "token") {
        axios.post("user/resetPasswordPage", url).then((res) => {
          if (res.data.status === "error") {
            history.push("/");
          }
        });
      } else {
        history.push("/");
      }
    } else {
      history.push("/");
    }
  }, []);

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("user/resetPassword", { password, url }).then((res) => {
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

  const handleClickShowPassword = (e) => {
    e.preventDefault();
    setShowPassword({ [e.currentTarget.name]: !showPassword[e.currentTarget.name] });
  };

  return (
    <Container className="resetPassword__body">
      <div id="background">
        <img src="img/homepage.jpg" alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <h3>Enter a new password</h3>

        <Grid container spacing={5} className="custom__form" style={{ marginTop: "50px" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="newPassword"
              value={password.newPassword || ""}
              onChange={handleChange}
              label="Please enter your new password"
              helperText="Must contain 8 characters, 1 letter, 1 number and 1 special character"
              variant="outlined"
              type={showPassword.newPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton name="newPassword" onClick={handleClickShowPassword} className="icon-btn">
                      {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              type={showPassword.confirmNewPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton name="confirmNewPassword" onClick={handleClickShowPassword} className="icon-btn">
                      {showPassword.confirmNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
export default ResetPassword;
