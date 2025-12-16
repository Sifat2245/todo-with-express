import { Request, Response } from "express";
import { todosService } from "./todos.service";

const createTodos = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  const id = user_id

  try {
    const result = await todosService.createTodos(id, title);

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
}

const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await todosService.getTodos()

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
}

const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todosService.getSingleTodo(req.params.id!);

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
}

const updateTodo = async (req: Request, res: Response) => {
  const { title, completed } = req.body;
  try {
    const result = await todosService.updateTodo(req.params.id!, title, completed);
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
}

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await todosService.deleteTodo(req.params.id!);
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
}

export const todosController = {
  createTodos,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo
}