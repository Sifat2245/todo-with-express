import express, { NextFunction, Request, Response } from "express";
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

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `[${new Date().toISOString()}] method ${req.method} url ${req.url}`
  );
  next();
};

app.get("/", logger, (req: Request, res: Response) => {
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
      success: true,
      data: result.rows[0],
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "something went wrong",
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      status: true,
      message: "Users received successfully",
      data: result?.rows,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User received successfully",
      data: result?.rows[0],
    });
  } catch (err: any) {
    console.log(err);
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, age = $3, address = $4 WHERE id = $5 RETURNING *`,
      [
        req.body.name,
        req.body.email,
        req.body.age,
        req.body.address,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: result?.rows[0],
    });
  } catch (err: any) {
    console.log(err);
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User Deleted successfully",
      data: null,
    });
  } catch (err: any) {
    console.log(err);
  }
});

//todos

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *",
      [user_id, title]
    );

    res.status(200).json({
      success: true,
      message: "Todo created successfully",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM todos");

    res.status(201).json({
      success: true,
      message: "Todos received successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "something went wrong",
    });
  }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM todos WHERE id =  $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { title, completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
      [title, completed, req.params.id]
    );
    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.delete("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: null,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.use((req, res) => [
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  }),
]);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
