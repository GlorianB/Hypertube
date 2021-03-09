import React, { useState, useContext } from "react";
import { Container, Grid, IconButton, Menu, MenuItem } from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import "./Profil.scss";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../App";

export const Profil = () => {
  const [setting, setSetting] = useState(null);
  const { userInfos } = useContext(AppContext);
  const openSetting = (e) => {
    setSetting(e.currentTarget);
  };
  const closeSetting = () => {
    setSetting(null);
  };

  return (
    <Container className="profil__body">
      <Grid item xs={12}>
        <IconButton className="profil__settings" onClick={openSetting}>
          <Settings />
        </IconButton>

        <Menu
          className="profil_menu"
          // id="simple-menu"
          anchorEl={setting}
          // keepMounted
          open={Boolean(setting)}
          onClose={closeSetting}
        >
          <MenuItem onClick={closeSetting}>
            <NavLink to="/EditProfil">Edit profil</NavLink>
          </MenuItem>
          <MenuItem onClick={closeSetting}>
            <NavLink to="/EditPassword">Edit password</NavLink>
          </MenuItem>
        </Menu>
      </Grid>
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          <img className="imgProfile" src={userInfos?.imgProfile} alt="" />
        </Grid>
        <Grid container className="profil__grid">
          <Grid item xs={12}>
            {userInfos?.username}
          </Grid>
        </Grid>
        <Grid container className="profil__grid">
          <Grid item xs={12}>
            France
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Profil;
