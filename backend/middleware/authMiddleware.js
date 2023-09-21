const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verifikasi token dan tangkap kesalahan jika token kedaluwarsa
      const decodedToken = jwt.verify(token, "secret_key");
      const userId = decodedToken.userId;

      const newToken = jwt.sign({ userId: decodedToken.userId }, "secretKey", {
        expiresIn: "1h",
      });

      // Menyimpan token baru dalam header response
      res.setHeader("Authorization", newToken);
      req.user = { userId: decodedToken.userId };

      let user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const session = user.sessions.find((session) => session.token === token);

      if (!session) {
        // Hapus token yang kedaluwarsa
        user.sessions = user.sessions.filter(
          (session) => session.token !== token
        );
        await user.save();

        return res.status(401).json({ message: "Token expired" });
      }

      user = await User.findById(userId);

      await user.save();

      req.user = { userId };
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Hapus token yang kedaluwarsa
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.userId;

        let user = await User.findById(userId);

        if (user) {
          user.sessions = user.sessions.filter(
            (session) => session.token !== token
          );
          await user.save();
        }

        return res.status(401).json({ message: "Token expired" });
      }

      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authenticateUser };
