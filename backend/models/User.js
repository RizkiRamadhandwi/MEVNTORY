const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  namaLengkap: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
    default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
  },
  phone: {
    type: String,
    default: "+62",
    required: true,
  },
  companyName: {
    type: String,
    default: "PT. XYZ",
    required: true,
  },
  address: {
    type: String,
    default: "Jl. XYZ",
    required: true,
  },

  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      loggedInAt: {
        type: Date,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
