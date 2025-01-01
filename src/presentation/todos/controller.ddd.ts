import type { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";


/**
 * This is a backup of the controller until the refactor to use cases
 */
export class TodosController {
    constructor(private readonly todoRepository: TodoRepository) {}

    public getTodos = async (_req: Request, res: Response) => {
        const todos = this.todoRepository.getAll();
        res.json(todos);
    };

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }

        try {
            const todo = await this.todoRepository.findById(id);
            res.json(todo);
        } catch (error) {
            res.status(404).json({ error });
        }
    };

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) {
            res.status(400).json({ error });
            return;
        }
        const todo = await this.todoRepository.create(createTodoDto!);
        res.json(todo);
    };

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
        res.json(updatedTodo);
    };

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({ error: "ID argument is not a number" });
            return;
        }
        const deletedTodo = await this.todoRepository.deleteById(id);

        if (deletedTodo) res.json(deletedTodo);
        else res.status(400).json({ error: `Todo with id ${id} does not exist`});
    };
}
