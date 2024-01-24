import { Response, Request } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto } from '../../domain/dtos';

export class TodoController {
  // DI: Dependency injection
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany({});
    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo)
      return res
        .status(400)
        .json({ error: `No se ha encontrado un todo con el id ${id}` });

    return res.json(todo);
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: 'text property is required' });

    // usamos el signo "!" porque ya tenemos "createTodoDto"
    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    return res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: 'id argument is not a number' });

    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: 'text property is required ' });

    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      return res.status(400).json({
        error: `No se ha encontrado un todo con el id ${id}`,
      });
    }

    const todoUpdated = await prisma.todo.update({
      where: { id },
      data: { text },
    });

    return res.json(todoUpdated);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      return res.status(400).json({
        error: `No se ha encontrado un todo con el id ${id}`,
      });
    }
    await prisma.todo.delete({ where: { id } });

    return res.status(201).json({});
  };
}
