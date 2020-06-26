const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));
const routes = require("./routes");
const assert = require("assert");

app.response.sendStatus = function (statusCode, type, message) {
  return this.contentType(type).status(statusCode).send(message);
};

app.all("/api/users(/:id)?", function (req, res, next) {
  const auth = true;
  if (auth) {
    console.log("Auth checked" + req.method);
    next();
  } else {
    res.sendStatus(401, "application/json", '{"error":"Please log in"}');
  }
});

app.use("/api/users", routes);

const port = 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
