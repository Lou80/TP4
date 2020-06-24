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

app.response.sendStatus = function (statusCode, type, message) {
  return this.contentType(type).status(statusCode).send(message);
};

app
  .route("/api/users")
  .get(function (req, res) {
    Employee.find(function (err, employees) {
      if (err) return console.log(err);
      res.json(employees);
    });
  })
  .post(function (req, res) {
    const { name, email, address, phoneNumber } = req.body;
    const newEmployee = new Employee({
      name: name,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
    });
    newEmployee.save(function (error) {
      if (error) {
        console.error(error);
        return res.sendStatus(400, "application/json", `error: ${error}`);
      }
      return res.json(newEmployee);
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

  .put(function (req, res) {
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
  });

const port = 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
