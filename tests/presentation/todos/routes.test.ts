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

  // Antes de cada prueba eliminamos todos los registros de la db
  beforeEach(async () => {
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
    expect(body[0].completedAt).toBeNull();
  });

  test('should return a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: null,
    });
  });

  test('should return a 404 Not Found api/todos/:id', async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(400);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test('should return a new Todo api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send(todo1)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test('should return an error if text is not present api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({})
      .expect(400);

    expect(body).toEqual({ error: 'Text property is required' });
  });

  test('should return an error if text is empty api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({ text: '' })
      .expect(400);

    expect(body).toEqual({ error: 'Text property is required' });
  });

  test('should return an updated TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({
        text: 'Buy hot chocolate',
        completedAt: '2024-01-24',
      })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: 'Buy hot chocolate',
      completedAt: '2024-01-24T00:00:00.000Z',
    });
  });

  // TODO: realizar la operacion con error personalizados
  test('should return 40 if TODO not found', async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({
        text: 'Buy hot chocolate',
        completedAt: '2024-01-24',
      })
      .expect(400);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test('should return an updated TODO only the date', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({
        completedAt: '2024-01-24',
      })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: '2024-01-24T00:00:00.000Z',
    });
  });

  test('should return an updated TODO only the text', async () => {
    const todo = await prisma.todo.create({ data: todo2 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({
        text: 'Buy eggs',
      })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: 'Buy eggs',
      completedAt: null,
    });
  });

  test('should delete an todo api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo2 });
    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: null,
    });
  });

  // TODO: Cambiar 404
  test('should return 404 if todo not exist api/todos/:id', async () => {
    const todoId = 999;

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todoId}`)
      .expect(400);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });
});
