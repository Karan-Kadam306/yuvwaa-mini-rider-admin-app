const express = require("express");
const router = express.Router();
const controller = require("../controllers/ridersController");

router.post("/", controller.createRider);
router.get("/", controller.getRiders);

module.exports = router;