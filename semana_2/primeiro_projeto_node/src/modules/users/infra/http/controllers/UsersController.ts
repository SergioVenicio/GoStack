import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UserInterface } from '@modules/users/infra/typeorm/entities/User';

import CreateUser from '@modules/users/services/CreateUser';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(CreateUser);
    const { name, email, password } = <UserInterface>request.body;
    const user = await service.execute({ name, email, password });

    return response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
}
