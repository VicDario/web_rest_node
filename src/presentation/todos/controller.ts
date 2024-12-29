import type { Request, Response } from "express";

const todos = [
    { id: 1, text: "Buy Milk", createAt: new Date() },
    { id: 2, text: "Buy Bread", createAt: new Date() },
];

export class TodosController {
    constructor() {}

    public getTodos = (_req: Request, res: Response) => {
        res.json(todos);
    };

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;

        if (isNaN(id)) {
            res.status(400).json({ error: 'ID argument is not a number' });
            return;
        }
        
        const todo = todos.find((todo) => todo.id === id);
        if (todo) res.json(todo);
        else res.sendStatus(404);
    };
}
