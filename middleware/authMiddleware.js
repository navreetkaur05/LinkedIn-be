import jwt from "jsonwebtoken";
import User from "../model/User.model.js";
import ConnectionModel from "../model/Connection.model.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please log in"
    });
  }

  const token = header.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(401).json({
      message: "User no longer exists"
    });
  }

  req.user = user;
  next();
}