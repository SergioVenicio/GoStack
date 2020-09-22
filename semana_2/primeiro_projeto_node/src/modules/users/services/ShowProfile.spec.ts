import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfile from './ShowProfile';

let repository: FakeUsersRepository;
let service: ShowProfile;

describe('UpdateProfile', () => {
  beforeEach(() => {
    repository = new FakeUsersRepository();
    service = new ShowProfile(repository);
  });

  it('should be able to show the profile', async () => {
    const user = await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const profile = await service.execute({ user_id: user.id });
    expect(profile?.name).toBe('Test');
    expect(profile?.email).toBe('test@test.com');
  });

  it('should not be able to show the profile with invalid id', async () => {
    await expect(service.execute({ user_id: '121212' })).rejects.toBeInstanceOf(
      AppError
    );
  });
});
