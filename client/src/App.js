import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "@material-ui/core";
import { Header } from "./components/Header/Header";
import { HomePage } from "./components/HomePage/HomePage";
import { ListMovie } from "./components/ListMovie/ListMovie";
import { SignInUp } from "./components/SignInUp/SignInUp";
import { PlayerPage } from "./components/PlayerPage/PlayerPage";
import { Profil } from "./components/Profil/Profil";
// import { ActivateUser } from "./components/ActivateUser/ActivateUser";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./assets/Style.scss";
import { ResetPasswordEmail } from "./components/ResetPassword/ResetPasswordEmail";
import { ResetPassword } from "./components/ResetPassword/ResetPassword";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import { EditProfil } from "./components/Profil/EditProfil";
import { EditPassword } from "./components/Profil/EditPassword";
import { ListUsers } from "./components/ListUsers/ListUsers";

//INITIALIZE CONTEXT
export const AppContext = createContext();

axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

function App() {
  const mobileDevice = useMediaQuery(`(max-width: 425px)`);
  const tabletDevice = useMediaQuery(`(min-width: 426px) and (max-width: 768px)`);
  const desktopDevice = useMediaQuery(`(min-width: 769px)`);

  const [loaded, setLoaded] = useState(false);
  const [logged, setLogged] = useState(false);
  const [userInfos, setUserInfos] = useState("");
  const [search, setSearch] = useState("");

  const checkAuth = async () => {
    try {
      const response = await axios.get("/auth/is_logged");
      const auth = response.data;
      setUserInfos(auth.user);
      setLogged(auth.message);
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!loaded) return <div>Loading...</div>;
  else if (logged)
    return (
      <React.Fragment>
        <Router>
          <AppContext.Provider
            value={{
              logged,
              setLogged,
              userInfos,
              setUserInfos,
              search,
              setSearch,
              mobileDevice,
              tabletDevice,
              desktopDevice,
            }}
          >
            <Header />
            <Switch>
              <Route exact path="/HomePage" component={() => <HomePage />} />
              <Route path="/ListMovie" component={() => <ListMovie />} />
              <Route path="/ListUsers" component={() => <ListUsers />} />
              <Route path="/PlayerPage/:id" component={() => <PlayerPage />} />
              <Route exact path="/Profil" component={() => <Profil />} />
              <Route exact path="/EditProfil" component={() => <EditProfil />} />
              <Route exact path="/EditPassword" component={() => <EditPassword />} />
              <Route path="/ErrorPage" component={() => <ErrorPage />} />
              <Route path="/" component={() => <HomePage />} />
            </Switch>
          </AppContext.Provider>
        </Router>
      </React.Fragment>
    );
  else {
    return (
      <React.Fragment>
        <Router>
          <AppContext.Provider value={{ logged, setLogged, userInfos, setUserInfos }}>
            <Header />
            <Switch>
              <Route exact path="/ResetPasswordEmail" component={() => <ResetPasswordEmail />} />
              <Route exact path="/ResetPassword" component={() => <ResetPassword />} />
              <Route path="/" component={() => <SignInUp />} />
              <Route path="/ErrorPage" component={() => <ErrorPage />} />
            </Switch>
          </AppContext.Provider>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
