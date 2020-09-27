import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUser from '@modules/users/services/AuthenticateUser';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(AuthenticateUser);
    const { email, password } = request.body;

    const { token, user } = await service.execute({ email, password });
    return response.json({ token, user: classToClass(user) });
  }
}
