import { Response, Request } from 'express';

export class TodoController {
  // DI: Dependecy injection
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    res.json([
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
    ]);
  };
}
