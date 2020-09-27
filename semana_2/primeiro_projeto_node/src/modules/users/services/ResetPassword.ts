import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
import validate from 'uuid-validate';

import AppError from '@shared/errors/AppError';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPassword {
  private _repository: IUserTokensRepository;
  private _userRepository: IUsersRepository;
  private _hashProvider: IHashProvider;

  constructor(
    @inject('UserTokensRepository') repository: IUserTokensRepository,
    @inject('UsersRepository') userRepository: IUsersRepository,
    @inject('HashProvider') hashProvider: IHashProvider
  ) {
    this._repository = repository;
    this._userRepository = userRepository;
    this._hashProvider = hashProvider;
  }

  async execute({ token, password }: IRequest): Promise<void> {
    if (!validate(token)) {
      throw new AppError('User Token does not exists!');
    }
    const userToken = await this._repository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists!');
    }

    const user = await this._userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists!');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('User Token is expired!');
    }

    const hashedPassword = await this._hashProvider.generateHash(password);
    user.password = hashedPassword;
    await this._userRepository.save(user);
  }
}
