import { getRepository, Repository, Raw } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsReporitory from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IFindAllInMonthDTO from '@modules/appointments/dtos/IFindAllInMonthDTO';
import IFindAllInDayDTO from '@modules/appointments/dtos/IFindAllInDayDTO';

class AppointmentsRepository implements IAppointmentsReporitory {
  private _repository: Repository<Appointment>;

  constructor() {
    this._repository = getRepository(Appointment);
  }

  public async create({
    user_id,
    provider_id,
    date,
  }: ICreateAppointment): Promise<Appointment> {
    const newAppointment = await this._repository.create({
      user_id,
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

  public async findAllInMonth({
    provider_id,
    month,
    year,
  }: IFindAllInMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, `0`);
    const appointments = await this._repository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `TO_CHAR(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });

    return appointments;
  }

  public async findAllInDay({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, `0`);
    const parsedMonth = String(month).padStart(2, `0`);

    const appointments = await this._repository.find({
      where: {
        provider_id,
        date: Raw((dateFieldName) => {
          return `TO_CHAR(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`;
        }),
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async find(): Promise<Appointment[] | undefined> {
    return await this._repository.find();
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment[] | undefined> {
    const appointments = await this._repository.find({
      where: {
        provider_id,
        date,
      },
    });
    return appointments || undefined;
  }

  public async save(appointment: ICreateAppointment) {
    return await this._repository.save(appointment);
  }
}

export default AppointmentsRepository;
