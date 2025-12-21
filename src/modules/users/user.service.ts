import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {

  const { name, role, email, password, age, address } = payload;

  const hashedPassword = bcrypt.hashSync(password as string, 10)

  const result = await pool.query(
    "INSERT INTO users (name, role, email, password, age, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, role, email, hashedPassword, age, address]
  );

  return result;
};

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  return result;
};

const updateUser = async (
  name: string,
  email: string,
  age: number,
  address: string,
  id: string
) => {
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, age = $3, address = $4 WHERE id = $5 RETURNING *`,
    [name, email, age, address, id]
  );

  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userService = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
