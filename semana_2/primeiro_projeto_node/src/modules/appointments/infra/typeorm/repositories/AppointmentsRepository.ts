import { getRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsReporitory from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

class AppointmentsRepository implements IAppointmentsReporitory {
  private _repository: Repository<Appointment>;

  constructor() {
    this._repository = getRepository(Appointment);
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointment): Promise<Appointment> {
    const newAppointment = await this._repository.create({
      provider_id,
      date,
    });

    const usersRepository = new UsersRepository();
    const providerExist = await usersRepository.findById(provider_id);

    if (!providerExist) {
      throw new AppError("Provider id doesn't exist!");
    }

    await this.save(newAppointment);
    return newAppointment;
  }

  public async find(): Promise<Appointment[] | undefined> {
    return await this._repository.find();
  }

  public async findByDate(date: Date): Promise<Appointment[] | undefined> {
    return (await this._repository.find({ where: date })) || undefined;
  }

  public async save(appointment: ICreateAppointment) {
    return await this._repository.save(appointment);
  }
}

export default AppointmentsRepository;
