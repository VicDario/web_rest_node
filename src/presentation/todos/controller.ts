import type { Request, Response } from "express";
import { prisma } from "../../data/postgres";

const todos = [
    { id: 1, text: "Buy Milk", completedAt: new Date() },
    { id: 2, text: "Buy Bread", completedAt: null },
];

export class TodosController {
    constructor() {}

    public getTodos = async (_req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        res.json(todos);
    };

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;

        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }

        const todo = await prisma.todo.findFirst({ where: { id } });
        if (todo) res.json(todo);
        else res.sendStatus(404);
    };

    public createTodo = async (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: "Text property is required" });
            return;
        }
        const todo = await prisma.todo.create({
            data: { text },
        });

        res.json(todo);
    };

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }

        const todo = await prisma.todo.findFirst({ where: { id } });
        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }

        const { text, completedAt } = req.body;

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                text,
                completedAt: completedAt ? new Date(completedAt) : null,
            },
        });

        res.json(updatedTodo);
    };

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }

        const todo = await prisma.todo.findFirst({ where: { id } });
        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }

        const deleted = await prisma.todo.delete({ where: { id } });

        if (deleted) res.json({ deleted, todo });
        else res.status(400).json({ error: `Todo with id ${id} does not exist`});
    };
}
