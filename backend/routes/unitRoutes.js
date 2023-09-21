const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware.authenticateUser, unitController.createUnit);
router.get("/", authMiddleware.authenticateUser, unitController.getUnit);
// ...

router.put("/:id", authMiddleware.authenticateUser, unitController.updateUnit);
router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  unitController.deleteUnit
);

// ...

module.exports = router;
