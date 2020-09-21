import { v4 } from 'uuid';
import { isEqual } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsReporitory from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';

class FakeAppointmentsRepository implements IAppointmentsReporitory {
  private appointments: Appointment[] = [];

  public async create({
    provider_id,
    date,
  }: ICreateAppointment): Promise<Appointment> {
    const newAppointment = new Appointment();

    Object.assign(newAppointment, {
      id: v4(),
      provider_id,
      date,
    });

    this.appointments.push(newAppointment);
    return newAppointment;
  }

  public async find(): Promise<Appointment[] | undefined> {
    return;
  }

  public async findByDate(date: Date): Promise<Appointment[] | undefined> {
    const appointment = this.appointments.find((appointment) =>
      isEqual(appointment.date, date)
    );

    if (!appointment) return;

    return [appointment];
  }

  public async save(appointment: ICreateAppointment) {}
}

export default FakeAppointmentsRepository;
