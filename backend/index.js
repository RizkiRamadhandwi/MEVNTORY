require("dotenv").config();

const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const unitRoutes = require("./routes/unitRoutes");
const stockRoutes = require("./routes/stockRoutes");
const inTransactionRoutes = require("./routes/inTransactionRoutes");
const outTransactionRoutes = require("./routes/outTransactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const path = require("path");

const app = express();
const PORT = 4000;

connectDB;

app.use(express.json());

// CORS
app.use(cors());

// application/json response
app.use(bodyParser());

// middleware for cookies
app.use(cookieParser());

// Middleware untuk melayani file statis dari direktori 'uploads/'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("welcome to express mevntory");
});

//Router
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/unit", unitRoutes);
app.use("/stock", stockRoutes);
app.use("/intransaction", inTransactionRoutes);
app.use("/report", reportRoutes);
app.use("/outtransaction", outTransactionRoutes);

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("DB connected");
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
