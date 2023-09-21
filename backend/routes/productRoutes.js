const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware.authenticateUser,
  productController.createProduct
);
router.get("/", authMiddleware.authenticateUser, productController.getProduct);
router.get(
  "/stock",
  authMiddleware.authenticateUser,
  productController.getProduct2
);
router.put(
  "/:id",
  authMiddleware.authenticateUser,
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  productController.deleteProduct
);

module.exports = router;
