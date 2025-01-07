import exp from "constants";
import { prisma } from "../../../src/data/postgres";
import { testServer } from "../../test-server";
import request from "supertest";

describe("Todo route testing", () => {
    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    })

    const todo = { text: 'Todo one', completedAt: new Date() };
    const todoTwo = { text: 'Todo two'};

    test("should return TODOs api/todos", async () => {
        await prisma.todo.createMany({
            data: [todo, todoTwo],
        });

        const response = await request(testServer.app)
            .get("/api/todos")
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body[0].text).toBe(todo.text);
        expect(response.body[1].text).toBe(todoTwo.text);
    }); 

    test("should return a TODO /api/todo/:id", async () => {
        const savedTodo = await prisma.todo.create({ data: todo });

        const response = await request(testServer.app)
            .get(`/api/todos/${savedTodo.id}`)
            .expect(200);

        expect(response.body).toMatchObject({
            ...savedTodo,
            completedAt: savedTodo.completedAt?.toISOString()
        });
    });

    test("should return a 404 NotFound /api/todo/:id", async () => {
        const todoId = 1;
        const response = await request(testServer.app)
            .get(`/api/todos/${todoId}`)
            .expect(400);
            
        expect(response.body).toEqual({ error: `TODO with ID ${todoId} not found`});
    });
})