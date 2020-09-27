import Appointment from '@modules/appointments/infra/typeorm/enities/Appointment';
import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';
import IFindAllInMonthDTO from '../dtos/IFindAllInMonthDTO';
import FindAllInDayDTO from '../dtos/IFindAllInDayDTO';

interface IAppointmentsReporitory {
  create(appointment: ICreateAppointment): Promise<Appointment>;
  findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment[] | undefined>;
  findAllInMonth(data: IFindAllInMonthDTO): Promise<Appointment[]>;
  findAllInDay(data: FindAllInDayDTO): Promise<Appointment[]>;
  find(): Promise<Appointment[] | undefined>;
  save(appointment: ICreateAppointment): Promise<Appointment>;
}

export default IAppointmentsReporitory;
