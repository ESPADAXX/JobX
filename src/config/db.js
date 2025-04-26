const { connect } = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await connect(process.env.DB_CONNECTION_STRING);
    console.log(`MongoDB Connected successfully 🍃`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;