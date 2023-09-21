const mongoose = require("mongoose");

const outTransactionSchema = new mongoose.Schema({
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
      stock: {
        awal: {
          type: Number,
          required: true,
        },
        akhir: {
          type: Number,
          required: true,
        },
      },
      quantity: {
        type: Number,
        required: true,
      },
      hargaJual: {
        type: Number,
        required: true,
      },
      hargaTotal: {
        type: Number,
        required: true,
      },
    },
  ],
  subTotal: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

outTransactionSchema.index({ idTransaksi: 1, userId: 1 }, { unique: true }); // Menambahkan indeks dengan atribut idTransaksi dan userId

module.exports = mongoose.model("OutTransaction", outTransactionSchema);
