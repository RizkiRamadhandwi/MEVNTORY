const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  idProduk: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  hargaBeli: {
    type: Number,
    defaultValue: 0,
  },

  hargaJual: {
    type: Number,
    defaultValue: 0,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
