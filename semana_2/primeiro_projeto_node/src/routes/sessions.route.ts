import { Router } from 'express';

import AuthenticateUser from '../services/AuthenticateUser';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const service = new AuthenticateUser();
  const { email, password } = request.body;

  const token = await service.execute({ email, password });
  return response.json({ token });
});

export default sessionsRouter;
