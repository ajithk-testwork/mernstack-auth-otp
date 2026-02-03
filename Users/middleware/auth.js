import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find user in DB
    const user = await User.findById(decoded.id);

    if (!user || !user.isLoggedIn) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // 3. Match token with DB token
    if (user.token !== token) {
      return res.status(401).json({ message: "Invalid session token" });
    }

    // 4. Attach user
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
