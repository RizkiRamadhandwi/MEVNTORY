const Stock = require("../models/Stock");
const InTransaction = require("../models/InTransaction");
const OutTransaction = require("../models/OutTransaction.js");

const dashboardView = async (req, res) => {
  try {
    const stock = await Stock.find({
      userId: req.user.userId,
    })
      .populate({
        path: "productId",
        select: "idProduk name",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate({
        path: "productId",
        select: "idProduk name",
        populate: {
          path: "unit",
          select: "name",
        },
      });

    const pembelian = await InTransaction.find({
      userId: req.user.userId,
      //   products: { $elemMatch: { productId: { $ne: null } } },
    })
      .populate("products.productId")
      .exec();

    // const pembelian1 = pembelian.map(obj => {
    //   // Menggunakan method filter untuk memfilter array products
    //   const filteredProducts = obj.products.filter(product => product.productId !== null);

    //   // Mengembalikan objek dengan array products yang sudah difilter
    //   return { ...obj.toObject(), products: filteredProducts };
    // });

    const subBeli = pembelian.reduce((total, item) => total + item.subTotal, 0);
    const penjualan = await OutTransaction.find({
      userId: req.user.userId,
    })
      .populate("products.productId")
      .exec();

    // const penjualan1 = penjualan.map(obj => {
    //   // Menggunakan method filter untuk memfilter array products
    //   const filteredProducts = obj.products.filter(product => product.productId !== null);

    //   // Mengembalikan objek dengan array products yang sudah difilter
    //   return { ...obj.toObject(), products: filteredProducts };
    // });
    const subJual = penjualan.reduce((total, item) => total + item.subTotal, 0);

    // console.log(pembelian1);

    res.status(201).json({ stock, subBeli, subJual });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  dashboardView,
};
