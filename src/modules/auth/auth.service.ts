import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(
    { name: user.name, email: user.email },
    secret as string,
    { expiresIn: "1d" }
  );

  console.log(token);

  return { user, token };
};

export const authService = {
  loginUser,
};
