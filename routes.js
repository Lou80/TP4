const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
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

router
  .route("/")
  .get(function (req, res) {
    Employee.find(function (err, employees) {
      if (err) {
        res.sendStatus(400, "application/json", `error: ${error}`);
        return;
      }
      res.json(employees);
      return;
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
    newEmployee.save(function (error, myNewEmployee) {
      if (error) {
        res.sendStatus(404, "application/json", `error: ${error}`);
        return;
      }
      res.json(myNewEmployee);
    });
  });

router
  .route("/:id")
  .delete(function (req, res) {
    Employee.deleteOne({ _id: req.params.id }, function (err) {
      if (err) {
        res.sendStatus(404, "application/json", `error: ${error}`);
        return;
      }
      res.json();
      return;
    });
  })
  .put(function (req, res) {
    const { body } = req;
    const selectedId = { _id: req.params.id };
    Employee.find(selectedId, function (err, employee) {
      if (err) {
        res.sendStatus(404, "application/json", `error: ${error}`);
        return;
      }
      const original = employee[0];
      const update = {};
      for (let key in body) {
        if (body[key] !== original[key]) update[key] = body[key];
      }
      Employee.findOneAndUpdate(selectedId, update, { new: true }, function (
        err,
        updatedEmployee
      ) {
        if (err) {
          res.sendStatus(404, "application/json", `error: ${error}`);
          return;
        }
        res.json(updatedEmployee);
      });
    });
  });

module.exports = router;
