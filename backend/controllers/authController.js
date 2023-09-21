const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { namaLengkap, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      namaLengkap,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secret_key", {
      expiresIn: "1d",
    });

    // Create session object
    const session = {
      token,
      loggedInAt: new Date(),
    };

    // Add session to user's sessions array
    user.sessions.push(session);
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const { userId } = req.user;
    const { token } = req.body;

    // Find the user and remove the session with the provided token
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { sessions: { token } } },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Remove the session with the provided token
    user.sessions = user.sessions.filter((session) => session.token !== token);
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, logout };
