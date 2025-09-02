const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
  mongoose
    .connect(
      "mongodb+srv://reabilitado97:xfyNawVTAO2vnwJa@cluster0.gulwx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("Mongoose Connected");
    })
    .catch((error) => {
      console.log(error, "ERROR");
    });
};

module.exports = connectDatabase;
