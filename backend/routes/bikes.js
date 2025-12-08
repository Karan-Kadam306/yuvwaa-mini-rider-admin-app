const express = require("express");
const router = express.Router();
const controller = require("../controllers/bikesController");

router.post("/", controller.createBike);
router.get("/", controller.getBikes);

module.exports = router;