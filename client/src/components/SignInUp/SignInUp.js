import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";

import { TextField, Container, Tabs, Tab, Grid, Button, Box, IconButton, InputAdornment } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import "./SignInUp.scss";
import "../../assets/Style.scss";
import axios from "axios";
import SimpleSnackbar from "../SnackBar/SnackBar";
import { AppContext } from "../../App";

function TabPanel(props) {
  const { children, value, index } = props;
  return <div>{value === index && <Box p={3}>{children}</Box>}</div>;
}
export const SignInUp = (props) => {
  const url = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (url.search) {
      axios.post("user/activateUser", url).then((res) => {
        if (res.data.status === "error") {
          history.push("/");
        } else if (res.data.status === "success") {
          setAlert({
            open: true,
            message: res.data.message,
            status: res.data.status,
          });
        }
      });
    }
  }, []);

  const [userSignUp, setUserSignUp] = useState({
    imgProfile: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showSignUpPassword: false,
    showConfirmSignUpPassword: false,
  });

  const [userSignIn, setUserSignIn] = useState({
    username: "",
    password: "",
    showSigninPassword: false,
  });

  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    status: "",
  });
  const [errors, setErrors] = useState();

  const [tabsValue, setTabsValue] = useState(0);

  const { setLogged, setUserInfos } = useContext(AppContext);

  const handleChangeSignUp = (e) => {
    setUserSignUp({
      ...userSignUp,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeSignIn = (e) => {
    setUserSignIn({
      ...userSignIn,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    const response = await axios.post("user/signin", userSignIn);
    const result = response.data;

    if (result.status === "success") {
      setUserInfos(result.user);
      setLogged(true);
    } else if (result.status === "error") {
      setAlert({
        open: true,
        message: result.message,
        status: "error",
        date: new Date(),
      });
    }
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    axios.post("user/signup", userSignUp).then((res) => {
      if (res.data.errors) {
        var errors = res.data.errors;
        var mapped = errors.map((item) => ({ [item.param]: item.msg }));
        var newObj = Object.assign({}, ...mapped);
        setErrors(newObj);
        setAlert({
          open: true,
          message: "wrong input",
          status: "error",
          date: new Date(),
        });
      } else if (res.data.status === "error") {
        setAlert({
          open: true,
          message: res.data.message,
          status: "error",
          date: new Date(),
        });
      } else {
        const formData = new FormData();
        formData.append("img", userSignUp.imgProfile);
        formData.append("username", userSignUp.username);
        axios.post("user/uploadImg", formData).then(() => {
          setErrors("");
          setAlert({
            open: true,
            message: "An email has been sent to you",
            status: "success",
            date: new Date(),
          });
        });
      }
    });
  };
  const handleClickShowSignUpPassword = (e) => {
    setUserSignUp({
      ...userSignUp,
      [e.currentTarget.name]: !userSignUp[e.currentTarget.name],
    });
  };
  const handleClickShowSignInPassword = (e) => {
    setUserSignIn({
      ...userSignIn,
      [e.currentTarget.name]: !userSignIn[e.currentTarget.name],
    });
  };
  const uploadPhoto = (e) => {
    setUserSignUp({
      ...userSignUp,
      imgProfile: e.target.files[0],
    });
  };

  const handleChangeTabs = (event, newValue) => {
    setTabsValue(newValue);
  };

  const handleGoogleOauth = async (event) => {
    event.preventDefault();
    window.open("http://localhost:5000/api/v1/auth/google", "_self");
  };

  const handleFortyTwoOauth = (event) => {
    event.preventDefault();
    window.open("http://localhost:5000/api/v1/auth/42", "_self");
  };

  return (
    <Container className="homepage__body">
      <div id="background">
        <img src="img/homepage.jpg" alt="" />
      </div>
      <Tabs className="homepage__tabs " value={tabsValue} onChange={handleChangeTabs} centered>
        <Tab label="Sign up" className="font-size-20" />
        <Tab label="Sign in" className="font-size-20" />
      </Tabs>
      <TabPanel value={tabsValue} index={0}>
        <form onSubmit={handleSignUp}>
          <div className="homepage__profil-img">
            <img
              className="imgProfile"
              src={userSignUp.imgProfile === "" ? "/img/img-default.jpg" : URL.createObjectURL(userSignUp.imgProfile)}
              alt="Image profil"
            />
            <input
              accept="image/png, image/jpg, image/jpeg"
              style={{ display: "none" }}
              id="uploadImgProfile"
              multiple
              type="file"
              onChange={uploadPhoto}
            />
            <label htmlFor="uploadImgProfile">
              <Button component="span">
                <img src="/img/icons/add-circle.svg" className="uploadImgProfile-btn" alt="" />
              </Button>
            </label>
            <p style={{ color: "red", fontSize: "12px", margin: "-20px" }}>
              {errors?.imgProfile ? errors?.imgProfile : ""}
            </p>
          </div>
          <Grid container spacing={5} className="custom__form">
            <Grid item xs={6}>
              {/*firstname */}
              <TextField
                fullWidth
                name="firstname"
                onChange={handleChangeSignUp}
                value={userSignUp.firstname || ""}
                label={errors?.firstname ? "Errors" : "First name"}
                helperText={errors?.firstname ? errors?.firstname : ""}
                variant="outlined"
                className={errors?.firstname ? "errors" : ""}
                required
              />
            </Grid>
            <Grid item xs={6}>
              {/*LastName */}
              <TextField
                fullWidth
                name="lastname"
                onChange={handleChangeSignUp}
                value={userSignUp.lastname || ""}
                label={errors?.lastname ? "Errors" : "Last name"}
                helperText={errors?.lastname ? errors?.lastname : ""}
                variant="outlined"
                className={errors?.lastname ? "errors" : ""}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {/*username */}
              <TextField
                fullWidth
                name="username"
                onChange={handleChangeSignUp}
                value={userSignUp.username || ""}
                label={errors?.username ? "Errors" : "User name"}
                helperText={errors?.username ? errors?.username : ""}
                variant="outlined"
                className={errors?.username ? "errors" : ""}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {/*Email */}
              <TextField
                fullWidth
                name="email"
                onChange={handleChangeSignUp}
                value={userSignUp.email || ""}
                label={errors?.email ? "Errors" : "Adress email"}
                helperText={errors?.email ? errors?.email : ""}
                variant="outlined"
                className={errors?.email ? "errors" : ""}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {/*Password */}
              <TextField
                fullWidth
                name="password"
                onChange={handleChangeSignUp}
                value={userSignUp.password || ""}
                label={errors?.password ? "Errors" : "Password"}
                variant="outlined"
                helperText="Must contain 8 characters, 1 letter, 1 number and 1 special character"
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        name="showSignUpPassword"
                        onClick={handleClickShowSignUpPassword}
                        className="icon-btn"
                      >
                        {userSignUp.showSignUpPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={userSignUp.showSignUpPassword ? "text" : "password"}
                className={errors?.password ? "errors" : ""}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {/*ConfirmPassword */}
              <TextField
                fullWidth
                name="confirmPassword"
                onChange={handleChangeSignUp}
                value={userSignUp.confirmPassword || ""}
                label={errors?.confirmPassword ? "Errors" : "Confirm Password"}
                helperText={errors?.confirmPassword ? errors?.confirmPassword : ""}
                variant="outlined"
                className={errors?.confirmPassword ? "errors" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        name="showConfirmPassword"
                        onClick={handleClickShowSignUpPassword}
                        className="icon-btn"
                      >
                        {userSignUp.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={userSignUp.showConfirmPassword ? "text" : "password"}
                required
              />
            </Grid>
          </Grid>
          <Button className="custom__btn font-size-20" type="submit">
            Sign Up
          </Button>
        </form>
      </TabPanel>

      <TabPanel value={tabsValue} index={1}>
        <form onSubmit={handleSignIn}>
          <div className="homepage__profil-img">
            <img className="imgProfile" src="/img/img-default.jpg" alt="" />
          </div>

          <Grid container spacing={5} className="custom__form">
            <Grid item xs={12}>
              {" "}
              {/*username */}
              <TextField
                fullWidth
                name="username"
                onChange={handleChangeSignIn}
                value={userSignIn.username || ""}
                label="User name"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              {" "}
              {/*Password */}
              <TextField
                fullWidth
                name="password"
                onChange={handleChangeSignIn}
                value={userSignIn.password || ""}
                label="Password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        name="showSigninPassword"
                        onClick={handleClickShowSignInPassword}
                        className="icon-btn"
                      >
                        {userSignIn.showSignInPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={userSignIn.showSigninPassword ? "text" : "password"}
                required
              />
            </Grid>
          </Grid>
          <Grid style={{ textAlign: "start", marginTop: "18px" }}>
            <Link to="/ResetPasswordEmail">Forgot password</Link>
          </Grid>
          <Button className="custom__btn font-size-20" type="submit">
            Sign In
          </Button>
          <div className="separator"> OR </div>
          <Grid container className="homepage__omniauth">
            <Grid item xs={6}>
              <IconButton onClick={handleFortyTwoOauth}>
                <img src="/img/icons/42-logo.svg" alt="42-logo" />
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <IconButton onClick={handleGoogleOauth}>
                <img src="/img/icons/googleplus-logo.svg" alt="googleplus-logo" />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </TabPanel>

      {alert.open && (
        <SimpleSnackbar key={alert.date} message={alert.message} status={alert.status} teste={alert.open} />
      )}
    </Container>
  );
};

export default SignInUp;
