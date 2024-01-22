import { Response, Request } from 'express';

const todos = [
  {
    id: 1,
    text: 'Sacar a pasear a Milo',
    createdAt: new Date(),
  },
  {
    id: 2,
    text: 'Comprar huevo',
    createdAt: new Date(),
  },
];

export class TodoController {
  // DI: Dependency injection
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: 'id argument is not a number' });

    const todoFound = todos.find((todo) => todo.id === id);
    if (!todoFound)
      return res
        .status(404)
        .json({ error: `No se ha encontrado un todo con el id ${id}` });

    return res.json(todoFound);
  };

  public createTodo = (req: Request, res: Response) => {
    const body = req.body;

    return res.json(body);
  };
}
