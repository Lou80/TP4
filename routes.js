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
  officeElements: [String],
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
    const { name, email, address, phoneNumber, officeElements } = req.body;
    const newEmployee = new Employee({
      name: name,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      officeElements: officeElements,
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
        res.sendStatus(404, "application/json", `error: ${err}`);
        return;
      }
      const original = employee[0];
      const update = {};
      for (let field in body) {
        if (body[field] !== original[field]) update[field] = body[field];
      }
      Employee.findOneAndUpdate(selectedId, update, { new: true }, function (
        err,
        updatedEmployee
      ) {
        if (err) {
          res.sendStatus(404, "application/json", { error: err });
          return;
        }
        res.json(updatedEmployee);
      });
    });
  });

// const elements = require("./elements");
// router.use("/:id/elements", elements);

router
  .route("/:id/elements")
  .get(function (req, res) {
    const selectedId = req.params.id;
    Employee.findById(selectedId, "officeElements", function (err, employee) {
      if (err) {
        res.sendStatus(404, "application/json", `error: ${err}`);
        return;
      }
      res.json(employee.officeElements);
      return;
    });
  })
  .post(function (req, res) {
    const selectedId = req.params.id;
    const update = { $push: { officeElements: req.body } };
    Employee.findByIdAndUpdate(selectedId, update, { new: true }, function (
      err,
      updatedEmployee
    ) {
      if (err) {
        res.sendStatus(400, "application/json", `error: ${err}`);
        return;
      }
      res.json(updatedEmployee.officeElements);
      return;
    });
  });

router.route("/:id/elements/:elements").delete(function (req, res) {
  const selectedId = req.params.id;
  //   const update = { };
  //   for (let field in body) {
  //     if (body[field] !== original[field]) update[field] = body[field];
  //   }
  // Employee.findByIdAndUpdate
});

module.exports = router;
