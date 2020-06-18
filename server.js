const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
//app.use("/fotos", express.static("assets"));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
});

const kittySchema = new mongoose.Schema({
  name: String,
});

kittySchema.methods.speak = function () {
  const greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
};
const Kitten = mongoose.model("Kitten", kittySchema);
const silence = new Kitten({ name: "Silence" });
console.log(silence.name); // 'Silence'

//const Kitten = mongoose.model("Kitten", kittySchema);
const fluffy = new Kitten({ name: "fluffy" });
fluffy.speak();

// fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
});

app.response.sendStatus = function (statusCode, type, message) {
  return this.contentType(type).status(statusCode).send(message);
};

let userId = 2;

let users = [
  {
    id: 13,
    name: "Juan Carlos Batman",
    email: "juan.carlos@batman.com",
    address: "Pangolin 345, Wuhan",
    phoneNumber: 78963014,
  },
];

const validateReqBody = function (req, res, next) {
  const newEmployee = req.body;
  const phone = newEmployee.phoneNumber;
  const phoneOk = typeof phone;
  if (
    newEmployee.name.length > 30 ||
    !newEmployee.email.includes("@") ||
    phoneOk !== "number"
  ) {
    res.sendStatus(404, "application/json", '{"error":"resource not found"}');
  } else {
    req.body.id = req.method === "POST" ? userId++ : parseInt(req.params.id);
    next();
  }
};

const findUser = function (req, res, next) {
  const employeeId = parseInt(req.params.id);
  const employeeIndex = users.findIndex((user) => user.id === employeeId);
  if (employeeIndex >= 0) {
    req.index = employeeIndex;
    req.selectedId = employeeId;
    next();
  } else res.status(400).send("User not found");
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

app
  .route("/api/users")
  .get(function (req, res) {
    res.json(users);
  })
  .post(validateReqBody, function (req, res) {
    const newEmployee = req.body;
    users.push(newEmployee);
    res.json(newEmployee);
  });

app
  .route("/api/users/:id")
  .delete(findUser, function (req, res) {
    users = users.filter((user) => user.id !== req.selectedId);
    return res.json(users);
  })

  .put([validateReqBody, findUser], function (req, res) {
    const newEmployee = req.body;
    users.splice(req.index, 1, newEmployee);
    return res.json(newEmployee);
  });

app.listen(3000);
