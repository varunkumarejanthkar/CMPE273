"use strict";
const mongoose = require("mongoose");
//const { mongoDBURI } = require("./config");

const mongoDBURI = "mongodb+srv://admin:splitwisepass@cluster0.sasxg.mongodb.net/dbSplitwise?retryWrites=true&w=majority";


//Mongo Connection
const connectMongoDB = async () => {

  const options = {
    poolSize: 100,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };

  try {
    await mongoose.connect(mongoDBURI, options);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};

module.exports = connectMongoDB;
