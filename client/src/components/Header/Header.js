import React, { useState, useContext, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Grid, Popover, TextField, InputAdornment } from "@material-ui/core";
import { Link } from "react-router-dom";
import "../../assets/Style.scss";
import "./Header.scss";
import { ExitToApp, Movie, AccountCircle, Close, Search, Group } from "@material-ui/icons";
import { Profil } from "../Profil/Profil";
import { AppContext } from "../../App";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { DelayInput } from "react-delay-input";

export const Header = () => {
  const { logged, setLogged, search, setSearch, mobileDevice, desktopDevice } = useContext(AppContext);
  const [popover, setPopover] = useState(false);
  // const [menu, setMenu] = useState(false);
  const history = useHistory();

  const openPopover = (e) => {
    setPopover(e.currentTarget);
  };
  const closePopover = () => {
    setPopover(false);
  };
  // const openMenu = (e) => {
  //   setMenu(e.currentTarget);
  // };
  // const closeMenu = () => {
  //   setMenu(false);
  // };
  const handleLogout = async () => {
    const response = await axios.get("/auth/logout");
    const result = response.data;
    if (result.status === "success") setLogged(false);
    history.push("/");
  };
  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };
  const handleClickShowClearSearch = () => {
    setSearch("");
  };

  useEffect(() => {
    if (search) {
      history.push("/listmovie");
    }
  }, [search]);

  return (
    <div className="header__body">
      {logged === false ? (
        <img style={{ height: "40px", margin: "20px" }} src="/img/hypertube-logo.svg" alt="" />
      ) : (
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Link to="/HomePage" className="header__logo">
              {desktopDevice ? <img src="/img/hypertube-logo.svg" alt="" /> : <img src="/img/hp-logo.svg" alt="" />}
            </Link>
            <Grid item xs />
            {!mobileDevice ? (
              <div className="header__search-bar">
                <DelayInput
                  placeholder="Search"
                  minLength={2}
                  delayTimeout={1000}
                  onChange={handleSearch}
                  className="search-bar"
                  value={search}
                />
                {search ? (
                  <button className="cleanSearch" name="showSignUpPassword" onClick={handleClickShowClearSearch}>
                    <Close />
                  </button>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <IconButton className="header__icon">
                <Search />
              </IconButton>
            )}
            <IconButton className="header__icon">
              <Link to="/listmovie">
                <Movie />
              </Link>
            </IconButton>
            <IconButton className="header__icon">
              <Link to="/listusers">
                <Group />
              </Link>
            </IconButton>
            <IconButton onClick={openPopover} className="header__icon">
              <AccountCircle />
            </IconButton>
            <IconButton onClick={handleLogout} className="header__icon">
              <ExitToApp />
            </IconButton>
          </Toolbar>

          <Popover
            className="header_popover-profil"
            open={Boolean(popover)}
            anchorEl={popover}
            onClose={closePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Profil />
          </Popover>
        </AppBar>
      )}
    </div>
  );
};

export default Header;
