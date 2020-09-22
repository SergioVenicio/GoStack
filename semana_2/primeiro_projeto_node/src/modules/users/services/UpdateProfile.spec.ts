import { v4 } from 'uuid';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfile from './UpdateProfile';

let repository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let service: UpdateProfile;

describe('UpdateProfile', () => {
  beforeEach(() => {
    repository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    service = new UpdateProfile(repository, hashProvider);
  });

  it('should be able to update profile', async () => {
    const user = await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await service.execute({
      user_id: user.id,
      name: 'update',
      email: 'update@email.com',
    });

    expect(updatedUser?.name).toBe('update');
    expect(updatedUser?.email).toBe('update@email.com');
  });

  it('should not be able to update profile with non-existent user', async () => {
    await expect(
      service.execute({
        user_id: v4(),
        name: 'update',
        email: 'update@email.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile with a duplicated email', async () => {
    await repository.create({
      name: 'Test',
      email: 'test2@test.com',
      password: '123456',
    });
    const user = await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'update',
        email: 'test2@test.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile without password', async () => {
    await repository.create({
      name: 'Test',
      email: 'test2@test.com',
      password: '123456',
    });
    const user = await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'update',
        email: 'test2@test.com',
        password: '1212323233',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update profile password', async () => {
    const user = await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    const updatedUser = await service.execute({
      user_id: user.id,
      name: 'update',
      email: 'test2@test.com',
      password: '1212323233',
      oldPassword: '123456',
    });

    expect(updatedUser?.password).toBe('1212323233');
  });

  it('should not be able to update profile with wrong password', async () => {
    const user = await repository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'update',
        email: 'test2@test.com',
        password: '1212323233',
        oldPassword: '12345226',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
