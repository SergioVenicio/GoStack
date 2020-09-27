import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment, {
  AppointmentInterface,
} from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsReporitory from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProviders/models/ICacheProvider';

@injectable()
class CreateAppointmentsService {
  private _repository: IAppointmentsReporitory;
  private _nofiticationRepository: INotificationsRepository;
  private _cache: ICacheProvider;

  constructor(
    @inject('AppointmentsRepository')
    repository: IAppointmentsReporitory,

    @inject('NotificationsRepository')
    nofiticationRepository: INotificationsRepository,

    @inject('CacheProvider') cache: ICacheProvider
  ) {
    this._repository = repository;
    this._nofiticationRepository = nofiticationRepository;
    this._cache = cache;
  }

  public async execute({
    user_id,
    date,
    provider_id,
  }: AppointmentInterface): Promise<Appointment> {
    if (!date) {
      throw new AppError('Appointment date is required!');
    }

    if (user_id === provider_id) {
      throw new AppError("Can't create an appointment with yourself!");
    }

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("Can't create an appointment on a past date!");
    }

    const appointmentHour = getHours(appointmentDate);
    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm!'
      );
    }

    const alreadyExists = await this._repository.findByDate(
      appointmentDate,
      provider_id
    );
    if (alreadyExists && alreadyExists.length !== 0) {
      throw new AppError('This appointment date already exists!');
    }

    const appointment = this._repository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    const formatedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");
    await this._nofiticationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${formatedDate}`,
    });

    const params = `${provider_id}:${format(appointmentDate, 'yyyy-MM-dd')}`;
    const cacheKey = `provider-appointments:${params}`;
    await this._cache.invalidate(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentsService;
