import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProviders/models/IMailProvider';
import IUsersRepository from '../repositories/IUserRepository';
import UserToken from '../infra/typeorm/entities/UserToken';

interface IRequest {
  email: string;
}

@injectable()
export default class SendForgotPassword {
  private _repository: IUserTokensRepository;
  private _userRepository: IUsersRepository;
  private _mailProvider: IMailProvider;

  constructor(
    @inject('UserTokensRepository') repository: IUserTokensRepository,
    @inject('UsersRepository') userRepository: IUsersRepository,
    @inject('MailProvider') mailProvider: IMailProvider
  ) {
    this._repository = repository;
    this._userRepository = userRepository;
    this._mailProvider = mailProvider;
  }

  async execute({ email }: IRequest): Promise<void> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not exists!');
    }

    const { token } = (await this._repository.generate(user.id)) as UserToken;

    if (!token) return;

    this._mailProvider.sendMail({
      to: user,
      subject: '[GoBarber] Recuperção de senha',
      templateData: {
        file: path.resolve(__dirname, '..', 'views', 'forgot_password.hbs'),
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
      },
    });
  }
}
