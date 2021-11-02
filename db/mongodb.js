// connect to the database
const mongoose = require("mongoose");
const config = require('../config');

exports.connect = async () => {
  try{

    const conn = await mongoose.connect(config.mongodb.server);
    if (process.env.NODE_ENV !== "test") {
      console.log(`MongoDB Connected:${conn.connection.host}`.green.bold);
    }
  }
  catch(error){
    console.log(error);
  }
};