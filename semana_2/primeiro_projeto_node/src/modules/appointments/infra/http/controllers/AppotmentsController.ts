import Appointment from '../../typeorm/entities/Appointment';

import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointment from '@modules/appointments/services/CreateAppointment';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createService = container.resolve(CreateAppointment);
    const { date: rawDate, provider_id } = request.body;
    const date = parseISO(rawDate);

    const appointment = await createService.execute({ date, provider_id });
    return response.json(appointment);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const repository = new AppointmentsRepository();
    const appointments = await repository.find();
    return response.json({
      appointmens: appointments,
    });
  }
}
