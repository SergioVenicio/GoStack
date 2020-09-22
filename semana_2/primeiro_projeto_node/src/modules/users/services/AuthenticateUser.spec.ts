import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUser from '@modules/users/services/CreateUser';
import AuthenticateUser from './AuthenticateUser';

let repository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let service: AuthenticateUser;
let createService: CreateUser;

describe('AuthenticateUse', () => {
  beforeEach(() => {
    repository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    service = new AuthenticateUser(repository, hashProvider);
    createService = new CreateUser(repository, hashProvider);
  });

  it('should be able to authenticate', async () => {
    await createService.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456789',
    });

    const response = await service.execute({
      email: 'test@test.com',
      password: '123456789',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with a invalid password', async () => {
    await createService.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456789',
    });

    await expect(
      service.execute({
        email: 'test@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a invalid email', async () => {
    await createService.execute({
      name: 'Test',
      email: 'test@test.com',
      password: '123456789',
    });

    await expect(
      service.execute({
        email: 'anothertest@test.com',
        password: '123456789',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
