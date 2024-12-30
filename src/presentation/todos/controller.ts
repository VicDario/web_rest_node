import type { Request, Response } from "express";

const todos = [
    { id: 1, text: "Buy Milk", completedAt: new Date() },
    { id: 2, text: "Buy Bread", completedAt: null },
];

export class TodosController {
    constructor() {}

    public getTodos = (_req: Request, res: Response) => {
        res.json(todos);
    };

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;

        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }

        const todo = todos.find((todo) => todo.id === id);
        if (todo) res.json(todo);
        else res.sendStatus(404);
    };

    public createTodo = (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: "Text property is required" });
            return;
        }
        const newTodo = {
            id: todos.length + 1,
            text: text as string,
            completedAt: null,
        };
        todos.push(newTodo);
        res.json(newTodo);
    };

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }

        const todo = todos.find((todo) => todo.id === id);
        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }

        const { text, completedAt } = req.body;

        todo.text = text ?? todo.text;
        todo.completedAt = completedAt == null ? null : new Date(completedAt || todo.completedAt);

        if (completedAt) todo.completedAt = completedAt;

        res.json(todo);
    };
}
