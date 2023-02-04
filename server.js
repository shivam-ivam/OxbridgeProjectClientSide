const express = require("express");
const env = require("dotenv");
const { Router } = require("express");
const app = express();
const cors = require("cors");
env.config({ path: "./config.env" }); //   env file
const PORT = process.env.PORT;
app.use(
  cors({
    origin: process.env.BASE_URL,
  })
  );
  
require("./Database/dbConnection"); // connection to the data base
app.use(express.json());
app.use(require("./Routers/authenticate")); // signup , signin routes

app.get("/", (req, res) => {
  res.send("hello there");
});

app.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
