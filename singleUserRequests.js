const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());

router.all("*", cors());

router.use(function findUserIndex(req, res, next) {
  //console.log(req.data.params);
  //console.log(req.myParams);
  const selectedId = req.myParams;
  //console.log(selectedId);
  const selectedEmployee = req.users.findIndex(
    (user) => user.id === selectedId
  );
  //console.log(selectedEmployee);
  if (selectedEmployee >= 0) {
    req.selected = selectedEmployee;
    console.log(req.method);
    console.log(req.url);
    //console.log(next());
  } else {
    res.status(400).send("User not found");
  }
  next();
});

router.delete("/api/users/:id", function (req, res) {
  // const selectedId = parseInt(req.params.id);
  // const selectedEmployee = users.findIndex((user) => user.id === selectedId);
  // if (selectedEmployee >= 0) {
  console.log("llegó a delete" + req.selected);
  console.log("req.users" + req.users);
  // users = users.filter((user) => user.id !== req.selected);
  // return res.json(users);
  // } else {
  //   return res.status(400).send("no se encontró usuario");
  // }
});

// router.put("/api/users/:id", validateReqBody, function (req, res) {
//   // const selectedEmployee = users.findIndex((user) => user.id === req.body.id);
//   // if (selectedEmployee >= 0) {
//   const newEmployee = req.body;
//   users.splice(req.selectedEmployee, 1, newEmployee);
//   return res.json(newEmployee);
//   // } else {
//   //   return res.status(400).send("no se encontró usuario");
//   // }
// });

module.exports = router;
