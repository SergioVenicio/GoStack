import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPassword from '@modules/users/services/ResetPassword';

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ResetPassword);
    const { password, token } = request.body;

    await service.execute({ password, token });
    return response.status(204).json();
  }
}
