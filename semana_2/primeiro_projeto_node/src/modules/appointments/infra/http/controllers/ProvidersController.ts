import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviders from '@modules/appointments/services/ListProviders';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const service = container.resolve(ListProviders);
    const providers = await service.execute({ user_id });

    return response.json(classToClass(providers));
  }
}
