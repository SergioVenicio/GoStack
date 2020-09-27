import { v4 } from 'uuid';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import ResetPassoword from './ResetPassword';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let repository: FakeUserTokensRepository;
let userRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let service: ResetPassoword;

describe('ResetPassoword', () => {
  beforeEach(() => {
    repository = new FakeUserTokensRepository();
    userRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    service = new ResetPassoword(repository, userRepository, hashProvider);
  });

  it('should be able to reset password', async () => {
    const user = await userRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const hashPassword = jest.spyOn(hashProvider, 'generateHash');

    const { token } = await repository.generate(user.id);
    await service.execute({
      token,
      password: 'new pass',
    });

    const updatedUser = await userRepository.findById(user.id);

    expect(updatedUser?.password).toBe('new pass');
    expect(hashPassword).toBeCalledWith('new pass');
  });
  it('should not be able to reset the password non-existing token', async () => {
    await expect(
      service.execute({
        token: 'invalid-token',
        password: 'asdiasjidoiasdj',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password non-existing user', async () => {
    const { token } = await repository.generate('invalid id');
    await expect(
      service.execute({
        token,
        password: 'asdiasjidoiasdj',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password non-existing token', async () => {
    await expect(
      service.execute({
        token: v4(),
        password: 'asdiasjidoiasdj',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await userRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });
    const { token } = await repository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const mockDate = new Date();
      return mockDate.setHours(mockDate.getHours() + 3);
    });

    await expect(
      service.execute({
        token,
        password: 'asdiasjidoiasdj',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
