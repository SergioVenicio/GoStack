import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfile from '@modules/users/services/UpdateProfile';
import ShowProfile from '@modules/users/services/ShowProfile';

export default class ProfileController {
  public async get(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ShowProfile);

    const user_id = request.user.id;
    const user = service.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(UpdateProfile);
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const user = await service.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }
}
