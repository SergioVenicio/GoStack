import path from 'path';
import fs from 'fs';

import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import User from '../models/User';

interface AvatarPayload {
  mimetype: string;
  filename: string;
  user_id: string;
}
export default class AvatarUpload {
  VALID_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  async execute({ user_id, filename, mimetype }: AvatarPayload): Promise<User> {
    if (!this.VALID_MIMETYPES.includes(mimetype)) {
      throw new AppError('Invalid mimetype!');
    }

    const repository = getRepository(User);
    const user = await repository.findOne({ id: user_id });

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

    await repository.save({ ...user, avatar: filename });

    return user as User;
  }
}
