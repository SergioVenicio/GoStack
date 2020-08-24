import { isEqual } from 'date-fns';

import ReporitoryInterface from './Repository';

import Appointment from '../models/Appointment';

class AppointmentsRepository implements ReporitoryInterface<Appointment> {
  private instances: Appointment[];

  constructor() {
    this.instances = [];
  }

  public create(instance: Appointment): Appointment {
    this.instances.push(instance);
    return instance;
  }

  public all(): Appointment[] {
    return this.instances;
  }

  public findByDate(date: Date): Appointment | null {
    return (
      this.instances.find((appoinment) => isEqual(appoinment.date, date)) ||
      null
    );
  }
}

export default AppointmentsRepository;
