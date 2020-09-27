import Appointment from '../../typeorm/entities/Appointment';

import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointment from '@modules/appointments/services/CreateAppointment';
import { classToClass } from 'class-transformer';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const createService = container.resolve(CreateAppointment);
    const { date: rawDate, provider_id } = request.body;
    const date = parseISO(rawDate);

    const appointment = await createService.execute({
      user_id,
      provider_id,
      date,
    });
    return response.json(classToClass(appointment));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const repository = new AppointmentsRepository();
    const appointments = await repository.find();
    return response.json(classToClass(appointments));
  }
}
