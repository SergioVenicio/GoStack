import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointments from '../../../services/ListProviderAppointments';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    if (!day || !month || !year) {
      throw new AppError('A date is required!');
    }

    const service = container.resolve(ListProviderAppointments);
    const appointments = await service.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(classToClass(appointments));
  }
}
