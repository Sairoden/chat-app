const path = require("path");
const express = require("express");

const app = express();

app.use(express.json());

// Serve public
app.use(express.static(path.join(__dirname, "..", "public")));
app.all("*", (req, res, next) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;

// 8 ka na
