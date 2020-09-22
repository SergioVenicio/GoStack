import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUser from './CreateUser';

let repository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let service: CreateUser;

describe('CreateUser', () => {
  beforeEach(() => {
    repository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    service = new CreateUser(repository, hashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await service.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456789',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user without name', async () => {
    await expect(
      service.execute({
        name: '',
        email: 'test@test.com',
        password: '123456789',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user without email', async () => {
    await expect(
      service.execute({
        name: 'Test',
        email: '',
        password: '123456789',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user without password', async () => {
    await expect(
      service.execute({
        name: 'Test',
        email: 'test@test.com',
        password: '',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with a existent email', async () => {
    await service.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456789',
    });

    await expect(
      service.execute({
        name: 'Test',
        email: 'test@test.com',
        password: '123456789',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
