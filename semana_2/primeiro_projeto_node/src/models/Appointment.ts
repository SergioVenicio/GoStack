import { v4 } from 'uuid';

export interface AppointmentInterface {
  id?: string;
  provider: string;
  date: Date;
}

export default class Appointment implements AppointmentInterface {
  id?: string;
  provider: string;
  date: Date;

  constructor({ id, provider, date }: AppointmentInterface) {
    this.id = id ? id : v4();
    this.provider = provider;
    this.date = date;
  }
}
