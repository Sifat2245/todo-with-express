import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;

//db
const pool = new Pool({
  connectionString: `${process.env.PG_CONNECTION_STRING}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
};

initDB();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("creating a server with express");
});

app.post("/users", async (req: Request, res: Response) => {
  console.log(req.body);

  const { name, email, age, address } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, age, address]
    );
    console.log(result.rows[0]);
    res.status(201).json({
      message: "user stored successfully",
      success:  true,
      data: result.rows[0],
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "something went wrong",
    });
  }
  res.status(201).json({
    success: true,
    message: "api working",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
