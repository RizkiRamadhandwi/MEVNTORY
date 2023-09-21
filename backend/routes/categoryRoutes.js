const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware.authenticateUser,
  categoryController.createCategory
);
router.get(
  "/",
  authMiddleware.authenticateUser,
  categoryController.getCategory
);
router.put(
  "/:id",
  authMiddleware.authenticateUser,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  categoryController.deleteCategory
);

module.exports = router;
