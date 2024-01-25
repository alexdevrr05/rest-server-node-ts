import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {
  // Iniciamos el servidor antes de todas las pruebas
  beforeAll(async () => {
    await testServer.start();
  });

  // Despues de todas las pruebas
  afterAll(() => {
    // Quita el warning (el servidor no se
    //  terminó de manera agraciada)
    testServer.close();
  });

  // Antes de todo eliminamos todos los registros de la db
  beforeAll(async () => {
    await prisma.todo.deleteMany({});
  });

  const todo1 = { text: 'Buy coffe' };
  const todo2 = { text: 'Buy bread' };

  test('should return TODOs api/todos', async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const { body } = await request(testServer.app)
      .get('/api/todos')
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
    expect(body[0].completedAt).toBeUndefined();
  });

  test('should return a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: undefined,
    });
  });

  test('should return a 404 Not Found api/todos/:id', async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(400);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });
});
