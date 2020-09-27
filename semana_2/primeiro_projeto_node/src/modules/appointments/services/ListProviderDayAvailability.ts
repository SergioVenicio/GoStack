import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailability {
  private _repository: IAppointsRepository;

  constructor(
    @inject('AppointmentsRepository') repository: IAppointsRepository
  ) {
    this._repository = repository;
  }

  async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this._repository.findAllInDay({
      provider_id,
      year,
      month,
      day,
    });

    const hourStart = 8;

    const eachHourArray = Array.from(
      {
        length: 10,
      },
      (_, index) => index + hourStart
    );

    const currentTime = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      const compareTime = new Date(year, month - 1, day, hour);

      const hashAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );

      return {
        hour,
        available: !hashAppointmentInHour && isAfter(compareTime, currentTime),
      };
    });

    return availability;
  }
}
