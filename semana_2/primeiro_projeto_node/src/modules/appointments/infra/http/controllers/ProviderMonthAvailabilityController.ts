import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailability from '@modules/appointments/services/ListProviderMonthAvailability';
import { classToClass } from 'class-transformer';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    const service = container.resolve(ListProviderMonthAvailability);
    const providers = await service.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
    });

    return response.json(classToClass(providers));
  }
}
