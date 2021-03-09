const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const db = require("./services/db"); // Middleware qui connecte a la DB
const port = process.env.port || 8080;
require("dotenv/config");

const app = express();

corsOptions = { origin: false };
app.use(cors(corsOptions));

app.use(cors());
app.use(bodyparser.json());
app.use(db); //connect à la DB

//server listening
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`listening on ${port}`);
});

//routes
const userRoutes = require("./routes/user");

app.use("/user", userRoutes);
