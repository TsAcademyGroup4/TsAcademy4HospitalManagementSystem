import User from "../db/models/User.model.js";
import jwt from "jsonwebtoken";

const loginUser = async ({ email, password, actor }) => {
  const trimmedActor = String(actor).trim().toUpperCase();
  const trimmedEmail = String(email).trim().toLowerCase();

  const user = await User.findByEmail(trimmedEmail).select("+passwordHash");
  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new Error("Invalid Credentials");
  }

  const user_role = user.role;
  if (user_role !== trimmedActor) {
    throw new Error("Forbidden: Role mismatch");
  }

  if (!user.isActive) {
    throw new Error("Forbidden: User inactive");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");

  const payload = {
    sub: String(user._id),
    role: user.role,
    ...(user.departmentId ? { departmentId: String(user.departmentId) } : {}),
  };

  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" });

  await user.updateLastLogin();

  return {
    accessToken,
    user_role,
  };
};

export default { loginUser };