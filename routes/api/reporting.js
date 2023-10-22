const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");

// const { schemas } = require("../../models/order");
const reports = require("../../controllers/reports");

router.get("/", authenticate, reports.getReportingByDates);

module.exports = router;
