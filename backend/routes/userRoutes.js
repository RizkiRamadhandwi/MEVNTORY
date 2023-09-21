const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.authenticateUser, userController.getUserData);
router.put(
  "/",
  authMiddleware.authenticateUser,
  userController.upload.single("photo"),
  userController.updateUserData
);

module.exports = router;
