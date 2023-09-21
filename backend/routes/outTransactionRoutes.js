const express = require("express");
const router = express.Router();
const outTransactionController = require("../controllers/outTransactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware.authenticateUser,
  outTransactionController.createOutTransaction
);
router.get(
  "/",
  authMiddleware.authenticateUser,
  outTransactionController.getOutTransactions
);
router.get(
  "/detailPenjualan",
  authMiddleware.authenticateUser,
  outTransactionController.getDetailTransaction
);

router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  outTransactionController.deleteOutTransaction
);

module.exports = router;
