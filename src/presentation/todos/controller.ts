import type { Request, Response } from "express";

export class TodosController {
    constructor() { }

    public getTodos(req: Request, res: Response) {
        res.json([
            { id: 1, text: "Buy Milk", createAt: new Date() },
            { id: 2, text: "Buy Bread", createAt: new Date() },
        ]);
    }
}