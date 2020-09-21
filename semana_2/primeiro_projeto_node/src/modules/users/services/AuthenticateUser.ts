import { sign } from 'jsonwebtoken';

import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface UserAuthPayload {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

interface AuthParams {
  email: string;
  password: string;
}

@injectable()
class AuthenticateUser {
  private _repository: IUserRepository;
  private _hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository') repository: IUserRepository,
    @inject('HashProvider') hashProvider: IHashProvider
  ) {
    this._repository = repository;
    this._hashProvider = hashProvider;
  }

  async execute({ email, password }: AuthParams): Promise<UserAuthPayload> {
    const user = await this._repository.findByEmail(email);

    if (
      !user ||
      !(await this._hashProvider.compareHash(password, user.password))
    ) {
      throw new AppError('Invalid email or password!', 401);
    }

    const token = sign(
      {
        email: user.email,
        name: user.name,
      },
      authConfig.secret,
      {
        subject: user.id,
        expiresIn: authConfig.expiresIn,
      }
    );
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }
}

export default AuthenticateUser;
