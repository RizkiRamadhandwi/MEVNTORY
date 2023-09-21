const OutTransaction = require("../models/OutTransaction.js");
const InTransaction = require("../models/InTransaction");
const Stock = require("../models/Stock");

//POST /Outtransactions
const createOutTransaction = async (req, res) => {
  try {
    const { tanggal, products, subTotal } = req.body;
    const userId = req.user.userId; // Ambil ID pengguna dari data autentikasi

    // Generate idTransaksi
    const currentDate = new Date(tanggal);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    const startDate = new Date(
      year,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endDate = new Date(
      year,
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );

    const lastOutTransaction = await OutTransaction.findOne({
      tanggal: { $gte: startDate, $lt: endDate },
      userId,
    }).sort({ idTransaksi: -1 });

    let nextOutTransactionNumber = 1;
    if (lastOutTransaction && lastOutTransaction.idTransaksi) {
      const lastOutTransactionNumber = parseInt(
        lastOutTransaction.idTransaksi.substring(12)
      );
      nextOutTransactionNumber = lastOutTransactionNumber + 1;
    }

    const nextOutTransactionId = `TJ${year}${month}${day}${nextOutTransactionNumber
      .toString()
      .padStart(3, "0")}`;

    // let stock = await Stock.findOne({ productId, userId });

    // if (stock.stock < quantity) {
    //   return res.status(400).json({ message: "Insufficient stock" });
    // }

    // const lastInTransaction = await InTransaction.findOne({
    //   productId,
    //   userId,
    // })
    //   .sort({ tanggal: -1 })
    //   .select("tanggal");
    // if (lastInTransaction && new Date(tanggal) < lastInTransaction.tanggal) {
    //   return res.status(400).json({ message: "Invalid transaction date" });
    // }

    const Outtransaction = new OutTransaction({
      idTransaksi: nextOutTransactionId,
      tanggal,
      products,
      subTotal,
      userId,
    });

    await Outtransaction.save();

    products.forEach(async (product) => {
      const productId = product.productId;
      let stock = await Stock.findOne({ productId, userId });
      stock.stock -= product.quantity;
      await stock.save();
    });

    res.status(201).json(Outtransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /Outtransactions
const getDetailTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const idTransaksi = req.query.idTransaksi;
    const Outtransactions = await OutTransaction.findOne({
      userId,
      idTransaksi,
    })
      .populate("products.productId")
      .exec();

    console.log(Outtransactions);
    res.status(200).json(Outtransactions);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getOutTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const Outtransactions = await OutTransaction.find({ userId })
      .populate("products.productId")
      .exec();

    // const penjualan = Outtransactions.map(obj => {
    //   // Menggunakan method filter untuk memfilter array products
    //   const filteredProducts = obj.products.filter(product => product.productId !== null);

    //   // Mengembalikan objek dengan array products yang sudah difilter
    //   return { ...obj.toObject(), products: filteredProducts };
    // });

    console.log(Outtransactions);
    res.status(200).json(Outtransactions);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /Outtransactions/:id

// DELETE /Outtransactions/:id
const deleteOutTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const outTransactionId = req.params.id;

    const outTransaction = await OutTransaction.findOneAndRemove({
      _id: outTransactionId,
      userId,
    });
    if (!outTransaction) {
      return res.status(404).json({ message: "Out Transaction not found" });
    }

    const stock = await Stock.findOne({
      productId: outTransaction.productId,
      userId,
    });
    if (stock) {
      stock.stock += outTransaction.quantity;
      await stock.save();
    }

    res.status(200).json({ message: "Out Transaction deleted successfully" });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  deleteOutTransaction,
};

const getOutTransactionsPerTanggal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const Outtransactions = await OutTransaction.find({
      userId,
      tanggal: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.status(200).json(Outtransactions);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOutTransaction,
  getOutTransactions,
  deleteOutTransaction,
  getOutTransactionsPerTanggal,
  getDetailTransaction,
};
