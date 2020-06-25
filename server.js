const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));
const routes = require("./routes");
const assert = require("assert");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected!");
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [30, "Sorry, name is too long"],
  },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: {
    type: Number,
    min: [111111, "Not valid phone number"],
    max: [999999999999, "Not valid phone number"],
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

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
