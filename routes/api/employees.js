const express = require("express");
const router = express.Router();

const employee = require("../../controllers/employees");
const {
  authenticate,
  validateBody,
  upload,
  checkFileSize,
} = require("../../middlewares");
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

router.patch(
  "/:id/add-image",
  authenticate,
  upload,
  checkFileSize,
  employee.addImageToEmployee
);
router.patch(
  "/:id/delete-image",
  authenticate,
  employee.deleteImageFromEmployee
);

module.exports = router;
