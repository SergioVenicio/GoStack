import FakeAppointment from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderDayAvailability from './ListProviderDayAvailability';

let service: ListProviderDayAvailability;
let repository: FakeAppointment;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    repository = new FakeAppointment();
    service = new ListProviderDayAvailability(repository);
  });

  it('should be able to list day avaibality from provider', async () => {
    await repository.create({
      user_id: '2',
      provider_id: '1',
      date: new Date(2020, 8, 20, 14, 0, 0),
    });
    await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 20, 11).getTime();
    });

    const avaibality = await service.execute({
      provider_id: '1',
      month: 9,
      year: 2020,
      day: 20,
    });

    expect(avaibality).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    );
  });
});
