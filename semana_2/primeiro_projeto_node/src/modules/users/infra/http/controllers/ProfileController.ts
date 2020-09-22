import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfile from '@modules/users/services/UpdateProfile';
import ShowProfile from '@modules/users/services/ShowProfile';

export default class ProfileController {
  public async get(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ShowProfile);

    const user_id = request.user.id;
    const user = service.execute({ user_id });

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(UpdateProfile);
    const user_id = request.user.id;
    const { name, email, oldPassword, password } = request.body;

    const user = await service.execute({
      user_id,
      name,
      email,
      oldPassword,
      password,
    });
    return response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
}
