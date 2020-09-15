import path from 'path';
import fs from 'fs';

import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

interface AvatarPayload {
  mimetype: string;
  filename: string;
  user_id: string;
}

@injectable()
export default class AvatarUpload {
  VALID_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  private _repository: IUserRepository;

  constructor(@inject('UsersRepository') repository: IUserRepository) {
    this._repository = repository;
  }

  async execute({ user_id, filename, mimetype }: AvatarPayload): Promise<User> {
    if (!this.VALID_MIMETYPES.includes(mimetype)) {
      throw new AppError('Invalid mimetype!');
    }

    const user = await this._repository.findById(user_id);

    if (!user) {
      throw new AppError('Invalid token!', 401);
    }

    console.log(user.avatar);

    if (user.avatar) {
      const oldAvatarPath = path.join(uploadConfig.directory, user.avatar);

      try {
        await fs.promises.unlink(oldAvatarPath);
      } catch (e) {}
    }

    await this._repository.save({ ...user, avatar: filename });

    return user as User;
  }
}
