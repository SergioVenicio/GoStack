import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment, { AppointmentInterface } from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

class CreateAppointmentsService {
  public async execute({
    date,
    provider,
  }: AppointmentInterface): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const alreadyExists = await repository.findByDate(date);

    if (alreadyExists !== null) {
      throw Error('This appointment date already exists!');
    }

    const appointment = repository.create({
      provider,
      date: appointmentDate,
    });

    await repository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentsService;
