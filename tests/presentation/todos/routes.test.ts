import request from 'supertest';
import { testServer } from '../../test-server';

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

  test('should return TODOs api/todos', async () => {
    const response = await request(testServer.app)
      .get('/api/todos')
      .expect(200);
  });
});
