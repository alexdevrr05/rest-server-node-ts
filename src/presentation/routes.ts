import { Router } from 'express';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get('/api/todos', (req, res) => {
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
    });

    return router;
  }
}
