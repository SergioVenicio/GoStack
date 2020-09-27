import FakeAppointment from '../repositories/fakes/FakeAppointmentRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProviders/fake/FakeCacheProvider';
import ListProviderAppointments from './ListProviderAppointments';

let service: ListProviderAppointments;
let cache: FakeCacheProvider;
let repository: FakeAppointment;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    repository = new FakeAppointment();
    cache = new FakeCacheProvider();
    service = new ListProviderAppointments(repository, cache);
  });

  it('should be able to list appointments on the a specific day', async () => {
    const appointment1 = await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 10, 0, 0),
    });

    const appointment2 = await repository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 20, 11, 0, 0),
    });

    const appointments = await service.execute({
      provider_id: '1',
      year: 2020,
      month: 9,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
