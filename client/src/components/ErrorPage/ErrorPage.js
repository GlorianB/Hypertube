import React from "react";
import { Container } from "@material-ui/core";
import "./ErrorPage.scss";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <Container className="errorPage__body">
      <div id="background">
        <img src="img/errorpage.jpg" alt="error" />
      </div>
      <h1> Sorry, page not found</h1>
      <img src="/img/travolta.gif" alt="travolta" />
      <Link to="/" className="errorPage-btn color-btn">
        Back to home
      </Link>
    </Container>
  );
};

export default ErrorPage;
