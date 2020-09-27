import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

interface AvatarPayload {
  mimetype: string;
  filename: string;
  user_id: string;
}

@injectable()
export default class AvatarUpload {
  VALID_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  private _repository: IUserRepository;
  private _storage: IStorageProvider;

  constructor(
    @inject('UsersRepository') repository: IUserRepository,
    @inject('StorageProvider') storage: IStorageProvider
  ) {
    this._repository = repository;
    this._storage = storage;
  }

  async execute({ user_id, filename, mimetype }: AvatarPayload): Promise<User> {
    if (!this.VALID_MIMETYPES.includes(mimetype)) {
      throw new AppError('Invalid mimetype!');
    }

    const user = await this._repository.findById(user_id);

    if (!user) {
      throw new AppError('Invalid token!', 401);
    }

    if (user.avatar) {
      this._storage.deleteFile(user.avatar);
    }

    user.avatar = await this._storage.saveFile(filename);

    await this._repository.save(user);
    return user;
  }
}
