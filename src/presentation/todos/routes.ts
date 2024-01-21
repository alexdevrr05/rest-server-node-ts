import { Router } from 'express';
import { TodoController } from './controller';

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();

    const todoController = new TodoController();

    router.get('/', todoController.getTodos);

    return router;
  }
}
