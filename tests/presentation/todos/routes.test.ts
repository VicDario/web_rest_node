import exp from "constants";
import { prisma } from "../../../src/data/postgres";
import { testServer } from "../../test-server";
import request from "supertest";
import { text } from "stream/consumers";
import { error } from "console";

describe("Todo route testing", () => {
    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    });

    const todo = { text: "Todo one", completedAt: new Date() };
    const todoTwo = { text: "Todo two" };

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
            completedAt: savedTodo.completedAt?.toISOString(),
        });
    });

    test("should return a 404 NotFound /api/todo/:id", async () => {
        const todoId = 1;
        const response = await request(testServer.app)
            .get(`/api/todos/${todoId}`)
            .expect(400);

        expect(response.body).toEqual({
            error: `TODO with ID ${todoId} not found`,
        });
    });

    test("should return a new TODO api/todos", async () => {
        const response = await request(testServer.app)
            .post("/api/todos")
            .send(todo)
            .expect(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            text: todo.text,
        });
    });

    test("should return an error if body is not valid api/todos", async () => {
        const response = await request(testServer.app)
            .post("/api/todos")
            .send({})
            .expect(400);

        expect(response.body).toEqual({ error: expect.any(String) });
    });

    test("should return an error if text is empty api/todos", async () => {
        const response = await request(testServer.app)
            .post("/api/todos")
            .send({ text: "" })
            .expect(400);

        expect(response.body).toEqual({ error: expect.any(String) });
    });

    test("should return an updated TODO api/todos/:id", async () => {
        const savedTodo = await prisma.todo.create({ data: todo });

        const newText = "new task text";
        const newDate = "2023-12-20";

        const response = await request(testServer.app)
            .put(`/api/todos/${savedTodo.id}`)
            .send({ text: newText, completedAt: newDate })
            .expect(200);

        expect(response.body).toEqual({
            id: savedTodo.id,
            text: newText,
            completedAt: expect.stringContaining(newDate),
        });
    });

    test("should return 404 if TODO not found api/todos/:id", async () => {
        const todoId = 1;
        const newText = "new task text";
        const newDate = "2023-12-20";

        const response = await request(testServer.app)
            .put(`/api/todos/${todoId}`)
            .send({ text: newText, completedAt: newDate })
            .expect(400);
            
        expect(response.body).toEqual({ error: `TODO with ID ${todoId} not found` });
    });

    test("should return an updated TODO only the date api/todos/:id", async () => {
        const savedTodo = await prisma.todo.create({ data: todo });
        const newDate = "2023-12-20";

        const response = await request(testServer.app)
            .put(`/api/todos/${savedTodo.id}`)
            .send({ completedAt: newDate })
            .expect(200);

        expect(response.body).toEqual({
            id: savedTodo.id,
            text: savedTodo.text,
            completedAt: expect.stringContaining(newDate),
        });
    });

    test("should return an updated TODO only the text api/todos/:id", async () => {
        const savedTodo = await prisma.todo.create({ data: todo });
        const newText = "Updated task text";

        const response = await request(testServer.app)
            .put(`/api/todos/${savedTodo.id}`)
            .send({ text: newText })
            .expect(200);

        expect(response.body).toEqual({
            id: savedTodo.id,
            text: newText,
            completedAt: savedTodo.completedAt?.toISOString(),
        });
    });
});
