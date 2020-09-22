import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPassword from '@modules/users/services/SendForgotPassword';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(SendForgotPassword);
    const { email } = request.body;

    await service.execute({ email });
    return response.status(204).json();
  }
}
