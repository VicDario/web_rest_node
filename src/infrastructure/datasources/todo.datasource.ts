import {
    CreateTodoDto,
    CustomError,
    TodoDatasource,
    TodoEntity,
    UpdateTodoDto,
} from "../../domain";
import { prisma } from "../../data/postgres";

export class TodoDatasourceImpl implements TodoDatasource {
    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto!,
        });
        return TodoEntity.fromObject(todo);
    }

    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();
        return todos.map(TodoEntity.fromObject);
    }

    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findFirst({ where: { id } });
        if (!todo) throw new CustomError(`TODO with ID ${id} not found`, 404);
        return TodoEntity.fromObject(todo);
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.findFirst({ where: { id: updateTodoDto.id } });
        if (!todo) throw new CustomError(`TODO with ID ${updateTodoDto.id} not found`, 404);

        const updatedTodo = await prisma.todo.update({
            where: { id: updateTodoDto.id },
            data: updateTodoDto!.values,
        });

        return TodoEntity.fromObject(updatedTodo);
    }

    async deleteById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findFirst({ where: { id } });
        if (!todo) throw new CustomError(`TODO with ID ${id} not found`, 404);

        const deleted = await prisma.todo.delete({ where: { id } });
        return TodoEntity.fromObject(deleted);
    }
}
