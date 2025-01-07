import type { NextFunction, Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import {
    CreateTodo,
    CustomError,
    GetTodo,
    GetTodos,
    TodoRepository,
    UpdateTodo,
} from "../../domain";
import { DeleteTodo } from "../../domain/use-cases/todo/delete-todo.usecase";

export class TodosController {
    constructor(private readonly todoRepository: TodoRepository) {}

    public getTodos = (_req: Request, res: Response, next: NextFunction) => {
        new GetTodos(this.todoRepository)
            .execute()
            .then((response) => res.json(response))
            .catch((error) => next(error));
    };

    public getTodoById = (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            next(new CustomError("ID argument is not a number"));
            return;
        }

        new GetTodo(this.todoRepository)
            .execute(id)
            .then((response) => res.json(response))
            .catch((error) => next(error));
    };

    public createTodo = (req: Request, res: Response, next: NextFunction) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) {
            next(new CustomError(error));
            return;
        }

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then((response) => res.status(201).json(response))
            .catch((error) => next(error));
    };

    public updateTodo = (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body,
            id,
        });
        if (error) {
            next(new CustomError(error));
            return;
        }

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then((response) => res.json(response))
            .catch((error) => next(error));
    };

    public deleteTodo = (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            next(new CustomError("ID argument is not a number"));
            return;
        }
        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then((response) => res.json(response))
            .catch((error) => next(error));
    };
}
