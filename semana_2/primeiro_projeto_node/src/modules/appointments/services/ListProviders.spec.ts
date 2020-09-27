import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProviders/fake/FakeCacheProvider';

import ListProviders from './ListProviders';

let repository: IUserRepository;
let service: ListProviders;
let cache: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    repository = new FakeUsersRepository();
    cache = new FakeCacheProvider();
    service = new ListProviders(repository, cache);
  });

  it('should be able to list the providers', async () => {
    await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await repository.create({
      name: 'Test',
      email: 'test2@test.com',
      password: '123456',
    });

    const user = await repository.create({
      name: 'Test',
      email: 'test3@test.com',
      password: '123456',
    });

    const providers = await service.execute({ user_id: user.id });

    expect(providers.length).toBe(2);
  });
});
