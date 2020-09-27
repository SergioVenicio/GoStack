import FakeAppointment from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderMonthAvailability from './ListProviderMonthAvailability';

let service: ListProviderMonthAvailability;
let repository: FakeAppointment;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    repository = new FakeAppointment();
    service = new ListProviderMonthAvailability(repository);
  });

  it('should be able to list month avaibality from provider', async () => {
    await repository.create({
      user_id: '2',
      provider_id: '1',
      date: new Date(2020, 8, 20, 8, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 9, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 10, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 11, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 12, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 13, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 14, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 15, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 16, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 17, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 18, 0, 0),
    });

    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 21, 10, 0, 0),
    });

    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 1, 21, 10, 0, 0),
    });

    const avaibality = await service.execute({
      provider_id: '1',
      month: 9,
      year: 2020,
    });

    expect(avaibality).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ])
    );
  });
});
