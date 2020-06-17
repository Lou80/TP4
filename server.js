const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));
//app.use("/fotos", express.static("assets"));
//app.use("/fotos", express.static(path.join(__dirname, "assets")));
const router = express.Router;

let userId = 2;

let users = [
  {
    id: 1,
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

app.delete("/api/users/:id", function (req, res) {
  const selectedId = parseInt(req.params.id);
  const selectedEmployee = users.findIndex((user) => user.id === selectedId);
  if (selectedEmployee >= 0) {
    users = users.filter((user) => user.id !== parseInt(req.params.id));
    return res.json(users);
  } else {
    return res.status(400).send("no se encontró usuario");
  }
});

app.put("/api/users/:id", validateReqBody, function (req, res) {
  const selectedEmployee = users.findIndex((user) => user.id === req.body.id);
  if (selectedEmployee >= 0) {
    const newEmployee = req.body;
    users.splice(selectedEmployee, 1, newEmployee);
    return res.json(newEmployee);
  } else {
    return res.status(400).send("no se encontró usuario");
  }
});

app.listen(3000);
