import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUser from './CreateUser';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const repository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const service = new CreateUser(repository, hashProvider);

    const user = await service.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456789',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with a existent email', async () => {
    const repository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();
    const service = new CreateUser(repository, hashProvider);
    await service.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456789',
    });

    expect(
      service.execute({
        name: 'Test',
        email: 'test@test.com',
        password: '123456789',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
