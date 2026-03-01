import User from "../db/models/User.model.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { actor } = req.params;
    const { email, password } = req.body;

    if (!email || !password || !actor) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ReasonPhrases.BAD_REQUEST });
    }

    const trimmedActor = String(actor).trim().toUpperCase();
    const trimmedEmail = String(email).trim().toLowerCase();

    const user = await User.findByEmail(trimmedEmail).select("+passwordHash");
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid Credentials" });
    }

    const user_role = user.role;
    if (user_role !== trimmedActor) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: ReasonPhrases.FORBIDDEN });
    }

    const isActive = user.isActive;
    if (!isActive) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: ReasonPhrases.FORBIDDEN });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const payload = {
      sub: String(user._id),
      role: user.role,
      ...(user.departmentId ? { departmentId: String(user.departmentId) } : {}),
    };

    const accessToken = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });

    await user.updateLastLogin();

    res.status(StatusCodes.OK).json({
      message: ReasonPhrases.OK,
      data: {
        accessToken,
        user_role,
      },
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
