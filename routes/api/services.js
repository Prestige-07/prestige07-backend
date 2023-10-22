const express = require("express");
const router = express.Router();

const service = require("../../controllers/services");
const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/service");

router.post(
  "/",
  authenticate,
  validateBody(schemas.addServiceSchema),
  service.addService
);

router.get("/", authenticate, service.getAllServices);

router.post(
  "/:id/update",
  authenticate,
  validateBody(schemas.updateServiceSchema),
  service.updateService
);

router.delete("/:id/delete", authenticate, service.deleteService);

module.exports = router;
