import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfile {
  private _repository: IUserRepository;
  private _hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository') repository: IUserRepository,
    @inject('HashProvider') hashProvider: IHashProvider
  ) {
    this._repository = repository;
    this._hashProvider = hashProvider;
  }

  async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User | undefined> {
    const user = await this._repository.findById(user_id);

    if (!user) {
      throw new AppError('User not exists!');
    }

    if (
      password &&
      (!old_password ||
        !(await this._hashProvider.compareHash(old_password, user.password)))
    ) {
      throw new AppError('Invalid user email or password!');
    }

    if (email !== user?.email && (await this._repository.findByEmail(email))) {
      throw new AppError('User email already exists !');
    }

    const newPassword = password
      ? await this._hashProvider.generateHash(password)
      : user.password;

    Object.assign(user, {
      name,
      email,
      password: newPassword,
    });

    return this._repository.save(user);
  }
}
