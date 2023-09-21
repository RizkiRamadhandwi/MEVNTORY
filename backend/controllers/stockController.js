const Stock = require("../models/Stock");

const getStockProduct = async (req, res) => {
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
    res.status(200).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getStockProduct };
