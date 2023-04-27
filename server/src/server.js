const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// Serve public
app.use(express.static(path.join(__dirname, "..", "public")));
app.all("*", (req, res, next) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
