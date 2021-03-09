const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../Hypertube.v1.json");
const cronjob = require("./api/services/cronjob");

require("dotenv").config();

const db = require("./api/services/db"); // Middleware qui connecte a la DB
const api = require("./api"); // Toute l'api

const app = express();
db(); // connect to the mongodb database
cronjob.start(); // start cronjob autodelete movies

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  }),
);

app.use(passport.initialize()); //Middleware qui initialise passport
app.use(passport.session()); // Middleware qui prend l'objet request et ajoute un req.user
app.use(fileUpload());

app.get("/", (req, res) =>
  res.json({
    message: "Hey",
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", api);

module.exports = app;
