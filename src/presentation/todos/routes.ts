import { Router } from 'express';
import { TodoController } from './controller';
import { TodoDatasourceImpl } from '../../infraestructure/datasource/todo.datasource.impl';
import { TodoRepositoryImpl } from '../../infraestructure/repositories/todo.repository.impl';

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new TodoDatasourceImpl();
    const todoRepository = new TodoRepositoryImpl(datasource);
    const todoController = new TodoController(todoRepository);

    router.get('/', todoController.getTodos);
    router.get('/:id', todoController.getTodoById);
    router.post('/', todoController.createTodo);
    router.put('/:id', todoController.updateTodo);
    router.delete('/:id', todoController.deleteTodo);

    return router;
  }
}
