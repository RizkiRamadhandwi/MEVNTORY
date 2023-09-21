const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getInTransactionsPerTanggal,
} = require("../controllers/inTransactionController");
const {
  getOutTransactionsPerTanggal,
} = require("../controllers/outTransactionController");

router.get("/in", authMiddleware.authenticateUser, getInTransactionsPerTanggal);
router.get(
  "/out",
  authMiddleware.authenticateUser,
  getOutTransactionsPerTanggal
);

module.exports = router;
