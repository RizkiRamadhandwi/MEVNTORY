const express = require("express");
const router = express.Router();
const inTransactionController = require("../controllers/inTransactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware.authenticateUser,
  inTransactionController.createInTransaction
);
router.get(
  "/",
  authMiddleware.authenticateUser,
  inTransactionController.getInTransactions
);
router.get(
  "/detailPembelian",
  authMiddleware.authenticateUser,
  inTransactionController.getDetailTransaction
);

router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  inTransactionController.deleteInTransaction
);

module.exports = router;
