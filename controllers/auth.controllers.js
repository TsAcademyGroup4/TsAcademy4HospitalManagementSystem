import User from "../db/models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ALLOWED_ACTORS = [
  "ADMIN",
  "DOCTOR",
  "FRONT_DESK",
  "NURSE",
  "PHARMACY",
  "BILLING",
];

export const login = async (req, res) => {
  try {
    const { actor } = req.params;
    const { email, password } = req.body;

    const normalizedActor = String(actor || "")
      .trim()
      .toUpperCase();
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (!ALLOWED_ACTORS.includes(normalizedActor)) {
      return res.status(400).json({ message: "Invalid Actor" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordHash",
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Inactive user" });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (user.role !== normalizedActor) {
      return res.status(403).json({ message: "Role doesn't match" });
    }

    user.lastLogin = new Date();
    await user.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const payload = {
      sub: String(user._id),
      role: user.role,
    };

    const accessToken = jwt.sign(payload, secret, { expiresIn: "1s" });

    return res.status(200).json({ accessToken, role: user.role });
  } catch (error) {
    return res.status(500).json({
      message: "Server hit an error",
      errorMessage: error.message,
    });
  }
};
