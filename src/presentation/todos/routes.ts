import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infrastructure/datasources/todo.datasource";
import { TodoRepositoryImpl } from "../../infrastructure/repositories/todo.repository";

export class TodoRoutes {
    static get routes(): Router {
        const router = Router();

        const todoDatasource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl(todoDatasource);
        const todosController = new TodosController(todoRepository);

        router.get("/", todosController.getTodos);
        router.post("/", todosController.createTodo);
        router.get("/:id", todosController.getTodoById);
        router.put("/:id", todosController.updateTodo);
        router.delete("/:id", todosController.deleteTodo);

        return router;
    }
}
