const express = require("express");
const cors = require("cors");
const app = express();
//app.use(cors());
app.all("*", cors());
app.use(express.json());
app.use(express.static("assets"));
//app.use("/fotos", express.static("assets"));
//app.use("/fotos", express.static(path.join(__dirname, "assets")));
const singleUser = require("./singleUserRequests");

//import { userId, users } from "./dataBase";
const dataBase = require("./dataBase");
// let userId = 2;

// let users = [
//   {
//     id: 1,
//     name: "Juan Carlos Batman",
//     email: "juan.carlos@batman.com",
//     address: "Bat St. 345, Gotham City",
//     phoneNumber: 78963014,
//   },
// ];

const { users, userId } = dataBase();
const validateReqBody = function (req, res, next) {
  const newEmployee = req.body;
  const phone = newEmployee.phoneNumber;
  const phoneOk = typeof phone;
  if (
    newEmployee.name.length > 30 ||
    !newEmployee.email.includes("@") ||
    phoneOk !== "number"
  ) {
    return res.status(400).send("Hubo un error en la carga de datos");
  } else {
    req.body.id = req.method === "POST" ? userId++ : parseInt(req.params.id);
    next();
  }
};

app.all("/api/users(/:id)?", function (req, res, next) {
  console.log("Auth checked" + req.method);
  req.users = users;
  //req.data = req;
  req.myParams = parseInt(req.params.id);
  //req.method = req.method;
  //console.log(req.url);
  //req.url = req.url;
  //req.data = req;
  //req.params.id
  //console.log(req.params.id);
  next();
});

app.use("/api/users/:id", singleUser);

app
  .route("/api/users")
  .get(function (req, res) {
    res.json(req.users);
  })
  .post(validateReqBody, function (req, res) {
    const newEmployee = req.body;
    users.push(newEmployee);
    res.json(newEmployee);
  });

app.listen(3000);
