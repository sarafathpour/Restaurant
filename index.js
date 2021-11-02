require('module-alias/register')
require('dotenv').config();

const express = require('express');
const colors = require("colors");
const mongoDb = require('./db/mongodb');
const router = require("./api/routes");
const errorHandler = require('./middlewares/error');

mongoDb.connect();
let app = express();
app.use(express.json());

//Dev Logging middleware
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use("/api", router);
app.use(errorHandler);

app.listen(
  process.env.PORT, 
  () => console.log(
      `The server is running in ${process.env.NODE_ENV} mode on server http://localhost:${process.env.PORT}`.green.bold
    )
)