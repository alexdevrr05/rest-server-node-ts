import request from 'supertest';
import { testServer } from '../../test-server';

describe('Todo route testing', () => {
  // Iniciamos el servidor
  beforeAll(async () => {
    await testServer.start();
  });

  test('should return TODOs api/todos', async () => {
    const response = await request(testServer.app).get('/api/todos');
  });
});
