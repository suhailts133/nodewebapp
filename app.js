// external libararies and modules
const express = require('express')
const env = require('dotenv').config();

// custom and other files
const db = require("./config/db.js")
db()

const app = express();


app.listen(process.env.PORT, () => console.log("server is running"));

module.exports = app;