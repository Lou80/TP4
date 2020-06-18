const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));
//app.use("/fotos", express.static("assets"));
const router = express.Router;

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
    return res.status(400).send("Hubo un error en la carga de datos");
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
  console.log("Auth checked" + req.method);
  next();
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

  .put(validateReqBody, findUser, function (req, res) {
    const newEmployee = req.body;
    users.splice(req.index, 1, newEmployee);
    return res.json(newEmployee);
  });

app.listen(3000);
