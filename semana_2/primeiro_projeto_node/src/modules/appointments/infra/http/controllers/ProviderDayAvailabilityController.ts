import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailability from '@modules/appointments/services/ListProviderDayAvailability';
import { classToClass } from 'class-transformer';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const service = container.resolve(ListProviderDayAvailability);
    const providers = await service.execute({
      provider_id,
      day: Number(day),
      year: Number(year),
      month: Number(month),
    });

    return response.json(classToClass(providers));
  }
}
