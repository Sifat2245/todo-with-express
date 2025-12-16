import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { logger } from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";
import { todosRoutes } from "./modules/todos/todos.routes";

//middlewares
const app = express();
const port = config.port;

//init db
initDB();

app.use(express.json());

app.get("/", logger, (req: Request, res: Response) => {
  res.send("creating a server with express");
});

app.use('/users', userRoutes);

app.use('/todos', todosRoutes)

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
