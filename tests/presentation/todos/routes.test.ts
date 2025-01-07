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

    const todo = { text: 'Todo one'};
    const todoTwo = { text: 'Todo two'};

    test("should return TODOs api/todos", async () => {
        await prisma.todo.deleteMany();
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
})