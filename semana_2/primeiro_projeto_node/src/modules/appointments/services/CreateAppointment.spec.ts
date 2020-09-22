import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointment from './CreateAppointment';

let repository: FakeAppointmentsRepository;
let service: CreateAppointment;

describe('CreateAppintment', () => {
  beforeEach(() => {
    repository = new FakeAppointmentsRepository();
    service = new CreateAppointment(repository);
  });
  it('should be able to create a new appointment', async () => {
    const appointment = await service.execute({
      date: new Date(),
      provider_id: '121212',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('121212');
  });

  it('should not be able to create a new appointment on the same time', async () => {
    const date = new Date();

    await service.execute({
      date,
      provider_id: '121212',
    });

    await expect(
      service.execute({
        date,
        provider_id: '232323',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
