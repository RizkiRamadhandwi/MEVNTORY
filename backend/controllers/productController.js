const Product = require("../models/Product");
const Stock = require("../models/Stock");
const InTransaction = require("../models/InTransaction");
const OutTransaction = require("../models/OutTransaction");

const createProduct = async (req, res) => {
  try {
    const { name, category, unit, hargaJual, hargaBeli } = req.body;
    const userId = req.user.userId;
    const existing = await Product.findOne({
      deleted: false,
      name,
      user: userId,
    });
    if (existing) {
      return res.status(400).json({ message: "already exists" });
    }

    // Generate idProduk
    const lastProduct = await Product.findOne({
      deleted: false,
      user: userId,
    }).sort({
      idProduk: -1,
    });
    let nextProductId = "BR0001";
    if (lastProduct && lastProduct.idProduk) {
      const lastProductId = lastProduct.idProduk;
      const lastProductNumber = parseInt(lastProductId.substring(2));
      nextProductId = `BR${(lastProductNumber + 1)
        .toString()
        .padStart(4, "0")}`;
    }

    const product = new Product({
      idProduk: nextProductId,
      name,
      category,
      unit,
      hargaJual,
      hargaBeli,
      user: userId, // Menggunakan ID pengguna yang terautentikasi
    });

    await product.save();

    const stock = new Stock({ productId: product._id, stock: 0, userId });
    await stock.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProduct2 = async (req, res) => {
  try {
    const products = await Product.find({
      deleted: false,
      user: req.user.userId,
    });
    // const products = await Stock.find({ userId: req.user.userId })
    //   .populate("productId")
    //   .exec();

    // console.log(products);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getProduct = async (req, res) => {
  try {
    // const products = await Product.find({ user: req.user.userId });
    const products = await Stock.find({
      userId: req.user.userId,
      // productId: { $elemMatch: { deleted: false } },
    }).populate("productId");

    const newProducts = products.map((product) => {
      // const ji = product.filter((o) => o.deleted === false);
      // const { _id, ...rest } = product.productId; // Menyalin seluruh properti kecuali _id
      return {
        ...product.productId.toObject(),
        stock: product.stock,
      };
    });

    const filterProductUndeleted = newProducts.filter(
      (product) => product.deleted == false
    );

    // console.log(newProducts);
    res.status(200).json(filterProductUndeleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, category, unit, hargaBeli, hargaJual } = req.body;
    const productId = req.params.id;
    const userId = req.user.userId;
    const product = await Product.findOneAndUpdate(
      { deleted: false, _id: productId, user: userId },
      { name, category, unit, hargaBeli, hargaJual },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.userId;
    // const product = await Product.findOneAndDelete({
    //   deleted: false,
    //   _id: productId,
    //   user: userId,
    // });
    const product = await Product.findOneAndUpdate(
      { deleted: false, _id: productId, user: userId },
      { deleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await InTransaction.deleteMany({ productId: productId });
    await OutTransaction.deleteMany({ productId: productId });
    await Stock.deleteMany({ productId: productId });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProduct2,
};
