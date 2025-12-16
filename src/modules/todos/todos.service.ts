import { pool } from "../../config/db";

const createTodos = async (id: string, title: string) => {
  const result = await pool.query(
    "INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *",
    [id, title]
  );

  return result;
};

const getTodos = async () => {
  const result = await pool.query("SELECT * FROM todos");
  return result;
};

const getSingleTodo = async (id: string) => {
  const result = await pool.query("SELECT * FROM todos WHERE id =  $1", [id]);

  return result;
};

const updateTodo = async (id: string, title: string, completed: boolean) => {
  const result = await pool.query(
    "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
    [title, completed, id]
  );

  return result;
};

const deleteTodo = async (id: string) => {
  const result = pool.query("DELETE FROM todos WHERE id = $1", [id]);
  return result;
};

export const todosService = {
  createTodos,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo
};
