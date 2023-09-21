const mongoose = require("mongoose");

const inTransactionSchema = new mongoose.Schema({
  idTransaksi: {
    type: String,
    required: true,
  },
  tanggal: {
    type: Date,
    required: true,
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      hargaBeli: {
        type: Number,
        required: true,
      },
      hargaTotal: {
        type: Number,
        required: true,
      },
    },
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subTotal: {
    type: Number,
    required: true,
  },
});

inTransactionSchema.index({ idTransaksi: 1, userId: 1 }, { unique: true }); // Menambahkan indeks dengan atribut idTransaksi dan userId

module.exports = mongoose.model("InTransaction", inTransactionSchema);
