import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Appointment, { AppointmentInterface } from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

class CreateAppointmentsService {
  public async execute({
    date,
    provider_id,
  }: AppointmentInterface): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const alreadyExists = await repository.findByDate(appointmentDate);

    if (alreadyExists !== null) {
      throw new AppError('This appointment date already exists!');
    }

    const appointment = repository.create({
      provider_id,
      date: appointmentDate,
    });

    await repository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentsService;
