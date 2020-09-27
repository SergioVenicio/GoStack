import FakeNotificationsRepository from '@modules/notifications/repositories/fake/FakeNotificationsRepository';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointment from './CreateAppointment';
import FakeCacheProvider from '@shared/container/providers/CacheProviders/fake/FakeCacheProvider';

let repository: FakeAppointmentsRepository;
let notificationRepository: FakeNotificationsRepository;
let service: CreateAppointment;
let cache: FakeCacheProvider;

describe('CreateAppintment', () => {
  beforeEach(() => {
    repository = new FakeAppointmentsRepository();
    notificationRepository = new FakeNotificationsRepository();
    cache = new FakeCacheProvider();
    service = new CreateAppointment(repository, notificationRepository, cache);
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 9, 12).getTime();
    });

    const appointment = await service.execute({
      date: new Date(2020, 8, 9, 13),
      provider_id: '121212',
      user_id: '12',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('121212');
  });

  it('should not be able to create a new appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 9, 12).getTime();
    });

    const date = new Date(2020, 8, 9, 13);

    await service.execute({
      date,
      provider_id: '121212',
      user_id: '12',
    });

    await expect(
      service.execute({
        date,
        provider_id: '232323',
        user_id: '12',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create a new appointment with on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 9).getTime();
    });

    await expect(
      service.execute({
        date: new Date(2020, 8, 8),
        provider_id: '121212',
        user_id: '12',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create a new appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 9).getTime();
    });

    await expect(
      service.execute({
        date: new Date(2020, 8, 10),
        provider_id: '12',
        user_id: '12',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create a new appointment before 8am and after 5pm', async () => {
    await expect(
      service.execute({
        date: new Date(2020, 8, 7),
        provider_id: '122',
        user_id: '12',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      service.execute({
        date: new Date(2020, 8, 20),
        provider_id: '122',
        user_id: '12',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
