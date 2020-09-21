import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fake/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AvatarUpload from './AvatarUpload';
import CreateUser from './CreateUser';

describe('AvatarUpload', () => {
  it('should be able to upload user avatar', async () => {
    const repository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUser(repository, hashProvider);
    const service = new AvatarUpload(repository, storageProvider);

    const user = await createUser.execute({
      name: 'test',
      email: 'test@test.com',
      password: '123456789',
    });

    const updated_user = await service.execute({
      user_id: user.id,
      filename: 'test_avatar.jpg',
      mimetype: 'image/jpeg',
    });

    expect(updated_user.avatar).toBe('test_avatar.jpg');
  });

  it('should be able to update user avatar', async () => {
    const repository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUser(repository, hashProvider);
    const service = new AvatarUpload(repository, storageProvider);

    const user = await createUser.execute({
      name: 'test',
      email: 'test@test.com',
      password: '123456789',
    });

    await service.execute({
      user_id: user.id,
      filename: 'test_avatar.jpg',
      mimetype: 'image/jpeg',
    });

    const updated_user = await service.execute({
      user_id: user.id,
      filename: 'test_2_avatar.jpg',
      mimetype: 'image/jpeg',
    });

    expect(updated_user.avatar).toBe('test_2_avatar.jpg');
  });

  it('should not be able to upload invalid user avatar', async () => {
    const repository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUser(repository, hashProvider);
    const service = new AvatarUpload(repository, storageProvider);

    expect(
      service.execute({
        user_id: '927834978213',
        filename: 'test_avatar.jpg',
        mimetype: 'image/jpeg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to upload user avatar with invalid mimetype', async () => {
    const repository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUser(repository, hashProvider);
    const service = new AvatarUpload(repository, storageProvider);

    expect(
      service.execute({
        user_id: '927834978213',
        filename: 'test_avatar.jpg',
        mimetype: 'image/invalid',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
