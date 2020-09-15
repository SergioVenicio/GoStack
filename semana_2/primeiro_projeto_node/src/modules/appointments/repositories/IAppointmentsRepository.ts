import Appointment from '@modules/appointments/infra/typeorm/enities/Appointment';
import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';

interface IAppointmentsReporitory {
  create(appointment: ICreateAppointment): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment[] | undefined>;
  find(): Promise<Appointment[] | undefined>;
  save(appointment: ICreateAppointment): Promise<Appointment>;
}

export default IAppointmentsReporitory;
