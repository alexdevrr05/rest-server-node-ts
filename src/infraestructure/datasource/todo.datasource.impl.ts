import { prisma } from '../../data/postgres';
import {
  CreateTodoDto,
  TodoDataSource,
  TodoEntity,
  UpdateTodoDto,
} from '../../domain';

export class TodoDatasourceImpl implements TodoDataSource {
  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany({});
    return todos.map((todo) => TodoEntity.fromObject(todo));
  }
  findById(id: number): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }
  updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: number): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }
}
