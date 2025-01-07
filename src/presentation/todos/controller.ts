import type { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import {
    CreateTodo,
    GetTodo,
    GetTodos,
    TodoRepository,
    UpdateTodo,
} from "../../domain";
import { DeleteTodo } from "../../domain/use-cases/todo/delete-todo.usecase";

export class TodosController {
    constructor(private readonly todoRepository: TodoRepository) {}

    public getTodos = (_req: Request, res: Response) => {
        new GetTodos(this.todoRepository)
            .execute()
            .then(response => res.json(response))
            .catch((error) => res.status(400).json({ error: error.message }));
    };

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }

        new GetTodo(this.todoRepository)
            .execute(id)
            .then((response) => res.json(response))
            .catch((error) => res.status(400).json({ error: error.message }));
    };

    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then((response) => res.status(201).json(response))
            .catch((error) => res.status(400).json({ error: error.message }));
    };

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body,
            id,
        });
        if (error) {
            res.status(400).json({ error });
            return;
        }

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then((response) => res.json(response))
            .catch((error) => res.status(400).json({ error: error.message }));
    };

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }
        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then((response) => res.json(response))
            .catch((error) => res.status(400).json({ error: error.message }));
    };
}
