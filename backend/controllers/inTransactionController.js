const InTransaction = require("../models/InTransaction");
const Stock = require("../models/Stock");

//POST /Intransactions
const createInTransaction = async (req, res) => {
  try {
    // console.log(req.body);

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

    const lastInTransaction = await InTransaction.findOne({
      tanggal: { $gte: startDate, $lt: endDate },
      userId,
    }).sort({ idTransaksi: -1 });

    let nextInTransactionNumber = 1;
    if (lastInTransaction && lastInTransaction.idTransaksi) {
      const lastInTransactionNumber = parseInt(
        lastInTransaction.idTransaksi.substring(12)
      );
      nextInTransactionNumber = lastInTransactionNumber + 1;
    }

    const nextInTransactionId = `TB${year}${month}${day}${nextInTransactionNumber
      .toString()
      .padStart(3, "0")}`;

    const Intransaction = new InTransaction({
      idTransaksi: nextInTransactionId,
      tanggal,
      products,
      subTotal,
      userId,
    });

    await Intransaction.save();

    products.forEach(async (product) => {
      const productId = product.productId;
      let stock = await Stock.findOne({ productId, userId });
      // Tambahkan kuantitas ke stok
      stock.stock += product.quantity;
      await stock.save();
    });

    res.status(201).json(req.body);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDetailTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log(req.query);
    const idTransaksi = req.query.idTransaksi;
    const Intransactions = await InTransaction.findOne({ userId, idTransaksi })
      .populate("products.productId")
      .exec();

    res.status(200).json(Intransactions);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /Intransactions
const getInTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const Intransactions = await InTransaction.find({ userId })
      .populate("products.productId")
      .exec();
      
    res.status(200).json(Intransactions);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /Intransactions/:id
const deleteInTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inTransactionId = req.params.id;

    const inTransaction = await InTransaction.findOne({
      _id: inTransactionId,
      userId,
    });
    if (!inTransaction) {
      return res.status(404).json({ message: "In Transaction not found" });
    }

    const stock = await Stock.findOne({
      productId: inTransaction.productId,
      userId,
    });
    if (stock.stock < inTransaction.quantity) {
      return res
        .status(400)
        .json({ message: "Cannot delete In Transaction. Insufficient stock" });
    }
    if (stock) {
      stock.stock -= inTransaction.quantity;
      await stock.save();
    }

    await inTransaction.deleteOne();

    res.status(200).json({ message: "In Transaction deleted successfully" });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /Intransactions
const getInTransactionsPerTanggal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const Intransactions = await InTransaction.find({
      userId,
      tanggal: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .populate("products.productId")
      .exec();
    res.status(200).json(Intransactions);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createInTransaction,
  getInTransactions,
  deleteInTransaction,
  getInTransactionsPerTanggal,
  getDetailTransaction,
};
