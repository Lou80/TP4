const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let userId = 2;

const users = [
  {
    id: 13,
    name: "Juan Carlos Batman",
    email: "juan.carlos@batman.com",
    address: "Pangolin 345, Wuhan",
    phoneNumber: 78963014,
  },
];

app.get("/api/users", function (req, res) {
  res.json(users);
});

app.post("/api/users", function (req, res) {
  const newEmployee = req.body;
  const phone = newEmployee.phoneNumber;
  const phoneOk = typeof phone;

  if (
    newEmployee.name.length > 30 ||
    !newEmployee.email.includes("@") ||
    phoneOk !== "number"
  ) {
    return res.status(400).send("error");
  }
  newEmployee.id = userId++;
  users.push(newEmployee);
  res.json(newEmployee);
});

app.delete("/api/users/:id", function (req, res) {
  res.json();
  //console.log(req.params.id);
});

app.listen(3000);
