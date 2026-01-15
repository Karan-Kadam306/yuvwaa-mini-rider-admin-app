const express = require("express");
const router = express.Router();
const controller = require("../controllers/RiderActivityController");

router.post("/upload", controller.uploadExcelData);
router.get("/", controller.getRiderActivity);

module.exports = router;
