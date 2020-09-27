import { v4 } from 'uuid';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsReporitory from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';

import IFindAllInMonthDTO from '@modules/appointments/dtos/IFindAllInMonthDTO';
import IFindAllInDayDTO from '@modules/appointments/dtos/IFindAllInDayDTO';

class FakeAppointmentsRepository implements IAppointmentsReporitory {
  private appointments: Appointment[] = [];

  public async create({
    user_id,
    provider_id,
    date,
  }: ICreateAppointment): Promise<Appointment> {
    const newAppointment = new Appointment();

    Object.assign(newAppointment, {
      id: v4(),
      user_id,
      provider_id,
      date,
    });

    this.appointments.push(newAppointment);
    return newAppointment;
  }

  public async find(): Promise<Appointment[] | undefined> {
    return;
  }

  public async findAllInMonth({
    provider_id,
    month,
    year,
  }: IFindAllInMonthDTO): Promise<Appointment[]> {
    return this.appointments.filter((appointment) => {
      const apponintmentMonth = getMonth(appointment.date) + 1;
      const apponintmentYear = getYear(appointment.date);

      return (
        appointment.provider_id === provider_id &&
        apponintmentMonth === month &&
        apponintmentYear === year
      );
    });
  }

  public async findAllInDay({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayDTO): Promise<Appointment[]> {
    return this.appointments.filter((appointment) => {
      const appointmentDay = getDate(appointment.date);
      const apponintmentMonth = getMonth(appointment.date) + 1;
      const apponintmentYear = getYear(appointment.date);

      return (
        appointment.provider_id === provider_id &&
        apponintmentYear === year &&
        apponintmentMonth === month &&
        appointmentDay === day
      );
    });
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment[] | undefined> {
    const appointment = this.appointments.find(
      (appointment) =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id
    );

    if (!appointment) return;

    return [appointment];
  }

  public async save(appointment: ICreateAppointment) {}
}

export default FakeAppointmentsRepository;
