import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailability {
  private _repository: IAppointsRepository;

  constructor(
    @inject('AppointmentsRepository') repository: IAppointsRepository
  ) {
    this._repository = repository;
  }

  async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {
    const numbersOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const eachDayArray = Array.from(
      { length: numbersOfDaysInMonth },
      (_, index) => index + 1
    );
    const appointments = await this._repository.findAllInMonth({
      month,
      year,
      provider_id,
    });

    const availability = eachDayArray.map((day) => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      const appointmentsInDay = appointments.filter((appointment) => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });
    return availability;
  }
}
