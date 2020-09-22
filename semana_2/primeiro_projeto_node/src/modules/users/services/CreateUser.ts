import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User, {
  UserInterface,
} from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

@injectable()
export default class CreateUser {
  ERROR_MESSAGE = 'This email has already been used';

  private _repository: IUserRepository;
  private _hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository') repository: IUserRepository,
    @inject('HashProvider') hashProvider: IHashProvider
  ) {
    this._repository = repository;
    this._hashProvider = hashProvider;
  }

  async execute({ name, email, password }: UserInterface): Promise<User> {
    const userExists = await this._repository.findByEmail(email);

    if (userExists) {
      throw new AppError(this.ERROR_MESSAGE);
    }

    if (!name) {
      throw new AppError('Name field must be required!');
    }

    if (!email) {
      throw new AppError('Email field must be required!');
    }

    if (!password || password.length < 6) {
      throw new AppError('Password must be at least 6 characters!');
    }

    const passwordHash = await this._hashProvider.generateHash(password);
    const user = await this._repository.create({
      name,
      email,
      password: passwordHash,
    });
    return user;
  }
}
