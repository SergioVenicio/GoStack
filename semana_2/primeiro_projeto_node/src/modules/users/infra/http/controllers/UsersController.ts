import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import { UserInterface } from '@modules/users/infra/typeorm/entities/User';

import CreateUser from '@modules/users/services/CreateUser';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(CreateUser);
    const { name, email, password } = <UserInterface>request.body;
    const user = await service.execute({ name, email, password });

    return response.json(classToClass(user));
  }
}
