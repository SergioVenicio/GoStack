import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AvatarUpload from '@modules/users/services/AvatarUpload';

export default class AvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(AvatarUpload);
    const { filename, mimetype } = request.file;
    const { id } = request.user;

    const user = await service.execute({ user_id: id, filename, mimetype });
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
