const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");
router.get(
  "/",
  authMiddleware.authenticateUser,
  stockController.getStockProduct
);
router.get(
  "/dashboard",
  authMiddleware.authenticateUser,
  dashboardController.dashboardView
);

module.exports = router;
