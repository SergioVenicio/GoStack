import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';
import User, { UserInterface } from '../models/User';

export default class CreateUser {
  ERROR_MESSAGE = 'This email has already been used';

  async execute({ name, email, password }: UserInterface): Promise<User> {
    const repository = getRepository(User);
    const userExists = await repository.findOne({ email });

    if (userExists) {
      throw new AppError(this.ERROR_MESSAGE);
    }

    const passwordHash = await hash(password, 8);
    const user = repository.create({ name, email, password: passwordHash });
    await repository.save(user);
    return user;
  }
}
