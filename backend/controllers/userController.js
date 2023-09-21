const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getUserData = async (req, res) => {
  try {
    const { userId } = req.user;

    // Retrieve user data
    const user = await User.findById(userId).select("-password");

    res.status(200).json(user);
    console.log(req.user.userId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

cloudinary.config({
  cloud_name: "drumqvfia",
  api_key: "337573918438612",
  api_secret: "zoY916SFvEYbRy7DlwhyxrqqL3Y",
});
const storage = multer.diskStorage({});

const upload = multer({ storage });

const updateUserData = async (req, res) => {
  try {
    const { userId } = req.user;
    const { namaLengkap, email, phone, companyName, address } = req.body;
    let userPict = "";

    // if (req.file) {
    //   const URL = req.protocol + "://" + req.get("host");
    //   userPict = URL + `/uploads/` + req.file.filename;
    // }

    if (req.file) {
      // Mengupload gambar ke Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Mengambil URL gambar dari respons Cloudinary
      userPict = result.secure_url;

      // Menghapus file lokal yang diunggah setelah diunggah ke Cloudinary
      fs.unlinkSync(req.file.path);
    }

    // Update user data
    const user = await User.findById(userId);

    user.namaLengkap = namaLengkap;
    user.email = email;
    user.phone = phone;
    user.companyName = companyName;
    user.address = address;

    if (userPict) {
      user.photo = userPict;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUserData, updateUserData, upload };
