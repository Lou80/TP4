const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());

router.response.sendStatus = function (statusCode, type, message) {
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
      //console.log(error);
      //assert.equal(error.errors, "some missing or invalid data");
      //assert.equal(error.errors["email"].message, "Path `email` is required.");
      // assert.equal(
      //   error.errors["address"].message,
      //   "Path `address` is required."
      // );

      if (error) {
        console.log(error);
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
      const original = employee[0];
      const update = {};
      if (name !== employee[0].name) update.name = name;
      // for (let key in req.body) {
      //   if (key !== `${original}.${key}`) {
      //     `${update}.${key}` = key;
      //   }
      // }

      const newEm = {
        name: name ? name : employee[0].name,
        email: email ? email : employee[0].email,
        address: address ? address : employee[0].address,
        phoneNumber: phoneNumber ? phoneNumber : employee[0].phoneNumber,
      };
      Employee.findOneAndUpdate(selectedId, update, { new: true }, function (
        err,
        newEmployee
      ) {
        if (err) return handleError(err);
        return res.json(newEmployee);
      });
    });
  });

module.exports = router;
