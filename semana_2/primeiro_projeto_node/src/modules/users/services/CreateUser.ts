import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User, {
  UserInterface,
} from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

@injectable()
export default class CreateUser {
  ERROR_MESSAGE = 'This email has already been used';

  private _repository: IUserRepository;

  constructor(@inject('UsersRepository') repository: IUserRepository) {
    this._repository = repository;
  }

  async execute({ name, email, password }: UserInterface): Promise<User> {
    const userExists = await this._repository.findByEmail(email);

    if (userExists) {
      throw new AppError(this.ERROR_MESSAGE);
    }

    const passwordHash = await hash(password, 8);
    const user = await this._repository.create({
      name,
      email,
      password: passwordHash,
    });
    return user;
  }
}
