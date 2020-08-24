import { startOfHour } from 'date-fns';

import Appointment, { AppointmentInterface } from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

class CreateAppointmentsService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ date, provider }: AppointmentInterface): Appointment {
    const appointmentDate = startOfHour(date);

    if (this.appointmentsRepository.findByDate(date) !== null) {
      throw Error('This appointment date already exists!');
    }

    const newAppointment = new Appointment({
      provider,
      date: appointmentDate,
    });
    return this.appointmentsRepository.create(newAppointment);
  }
}

export default CreateAppointmentsService;
