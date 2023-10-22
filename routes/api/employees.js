const express = require("express");
const router = express.Router();

const employee = require("../../controllers/employees");
const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/employee");

router.post(
  "/",
  authenticate,
  validateBody(schemas.addEmployeeSchema),
  employee.addEmployee
);

router.get("/", authenticate, employee.getAllEmployees);

router.post(
  "/:id/update",
  authenticate,
  validateBody(schemas.updateEmployeeSchema),
  employee.updateEmployee
);

router.delete("/:id/delete", authenticate, employee.deleteEmployee);

router.get("/for-user", employee.getAllEmployeesForUsers);

module.exports = router;
