const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected!");
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  address: String,
  phoneNumber: Number,
});

const Employee = mongoose.model("Employee", employeeSchema);

app.response.sendStatus = function (statusCode, type, message) {
  return this.contentType(type).status(statusCode).send(message);
};

const validateReqBody = function (req, res, next) {
  const newEmployee = req.body;
  const phone = newEmployee.phoneNumber ? newEmployee.phoneNumber : null;
  const phoneOk = typeof phone;
  if (
    // newEmployee.name.length > 30 ||
    // !newEmployee.email.includes("@") ||
    // phoneOk !== "number"
    !newEmployee
  ) {
    res.sendStatus(404, "application/json", '{"error":"resource not found"}');
  } else {
    //req.body.id = req.method === "POST" ? userId++ : parseInt(req.params.id);
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
    Employee.find(function (err, employees) {
      if (err) return console.log(err);
      res.json(employees);
    });
  })
  .post(validateReqBody, function (req, res) {
    const { name, email, address, phoneNumber } = req.body;
    const newEmployee = new Employee({
      name: name,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
    });
    newEmployee.save(function (err, silence) {
      if (err) return console.error(err);
      res.json(newEmployee);
    });
  });

app
  .route("/api/users/:id")
  .delete(function (req, res) {
    Employee.deleteOne({ _id: req.params.id }, function (err) {
      if (err) return handleError(err);
      return res.json();
    });
  })

  .put(
    //validateReqBody,
    //findUser,
    function (req, res) {
      const { name, email, address, phoneNumber } = req.body;
      const selectedId = { _id: req.params.id };
      Employee.find(selectedId, function (err, employee) {
        if (err) return console.log(err);
        const newEmployee = {
          name: name ? name : employee[0].name,
          email: email ? email : employee[0].email,
          address: address ? address : employee[0].address,
          phoneNumber: phoneNumber ? phoneNumber : employee[0].phoneNumber,
        };
        Employee.findOneAndReplace(
          selectedId,
          newEmployee,
          { new: true },
          function (err, myNewEmployee) {
            if (err) return handleError(err);
            return res.json(myNewEmployee);
          }
        );
      });
    }
  );

const port = 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
