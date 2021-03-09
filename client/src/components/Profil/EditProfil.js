import React, { useState, useContext } from "react";
import { TextField, Container, Grid, Button } from "@material-ui/core";
import "./EditProfil.scss";
import "../../assets/Style.scss";
import axios from "axios";
import countries from "./CountrySelect.json";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SimpleSnackbar from "../SnackBar/SnackBar";
import { AppContext } from "../../App";

// function countryToFlag(isoCode) {
//   return typeof String.fromCodePoint !== "undefined"
//     ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
//     : isoCode;
// }

export const EditProfil = () => {
  const { userInfos } = useContext(AppContext);
  const [user, setUser] = useState({
    imgProfile: userInfos?.imgProfile,
    firstname: userInfos?.firstname,
    lastname: userInfos?.lastname,
    username: userInfos?.username,
    email: userInfos?.email,
    language: userInfos?.language,
  });

  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    status: "",
  });

  const uploadPhoto = (e) => {
    setUser({
      ...user,
      imgProfile: e.target.files[0],
    });
  };
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeLanguage = (e, value) => {
    if (value === null) {
      setUser({
        ...user,
        language: "",
      });
    } else {
      setUser({
        ...user,
        language: value.name,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("user/editProfil", user).then((res) => {
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
        const formData = new FormData();
        formData.append("img", user.imgProfile);
        formData.append("username", user.username);
        axios.post("user/uploadImg", formData).then(() => console.log("image uploaded"));
      }
    });
  };

  return (
    <Container className="editProfil__body">
      <form onSubmit={handleSubmit}>
        <h3>Edit profil</h3>
        <div className="editProfil__profil-img">
          <img
            className="imgProfile"
            src={
              user.imgProfile === ""
                ? "/img/img-default.jpg"
                : user.imgProfile instanceof File
                ? URL.createObjectURL(user.imgProfile)
                : user.imgProfile
            }
            alt="profil"
          />
          <input
            accept="image/*"
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
          <p style={{ color: "red", fontSize: "14px", margin: "-10px" }}>
            {/* {errors?.imgProfile ? errors?.imgProfile : ""} */}
          </p>
        </div>
        <Grid container spacing={5} className="custom__form" style={{ marginTop: "10px" }}>
          <Grid item xs={6}>
            {/*firstname */}
            <TextField
              fullWidth
              name="firstname"
              onChange={handleChange}
              value={user.firstname || userInfos.firstname}
              label={"First name"}
              // helperText={errors?.firstname ? errors?.firstname : ""}
              variant="outlined"
              // className={errors?.firstname ? "errors" : ""}
            />
          </Grid>
          <Grid item xs={6}>
            {/*LastName */}
            <TextField
              fullWidth
              name="lastname"
              onChange={handleChange}
              value={user.lastname || userInfos.lastname}
              label={"Last name"}
              // helperText={errors?.lastname ? errors?.lastname : ""}
              variant="outlined"
              // className={errors?.lastname ? "errors" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            {/*username */}
            <TextField
              fullWidth
              name="username"
              onChange={handleChange}
              value={user.username || userInfos.username}
              label={"User name"}
              // helperText={errors?.username ? errors?.username : ""}
              variant="outlined"
              // className={errors?.username ? "errors" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            {/*Email */}
            <TextField
              fullWidth
              name="email"
              onChange={handleChange}
              value={user.email || userInfos.email}
              label={"Email"}
              // helperText={errors?.email ? errors?.email : ""}
              variant="outlined"
              // className={errors?.email ? "errors" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            {/*language */}
            <Autocomplete
              options={countries}
              onChange={handleChangeLanguage}
              getOptionLabel={(option) => option.name}
              renderOption={(option) => (
                <React.Fragment>
                  {option.name} ({option.code})
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="language"
                  label="Language"
                  value={user.language || userInfos.language}
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button className="custom__btn font-size-20" type="submit" style={{ marginTop: "40px" }}>
          Edit Profil
        </Button>
      </form>
      {alert.open && (
        <SimpleSnackbar key={alert.date} message={alert.message} status={alert.status} teste={alert.open} />
      )}
    </Container>
  );
};
export default EditProfil;
