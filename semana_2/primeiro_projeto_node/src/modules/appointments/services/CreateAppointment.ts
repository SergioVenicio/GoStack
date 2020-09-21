import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment, {
  AppointmentInterface,
} from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsReporitory from '@modules/appointments/repositories/IAppointmentsRepository';

@injectable()
class CreateAppointmentsService {
  private _repository: IAppointmentsReporitory;
  constructor(
    @inject('AppointmentsRepository')
    repository: IAppointmentsReporitory
  ) {
    this._repository = repository;
  }

  public async execute({
    date,
    provider_id,
  }: AppointmentInterface): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const alreadyExists = await this._repository.findByDate(appointmentDate);

    if (alreadyExists) {
      throw new AppError('This appointment date already exists!');
    }

    const appointment = this._repository.create({
      provider_id,
      date: appointmentDate,
    });
    return appointment;
  }
}

export default CreateAppointmentsService;
