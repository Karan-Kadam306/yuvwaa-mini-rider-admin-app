const express = require("express");
const router = express.Router();
const controller = require("../controllers/assignmentsController");

router.post("/", controller.createAssignment);
router.get("/", controller.getAssignments);
router.delete("/:id", controller.deleteAssignment);

module.exports = router;
