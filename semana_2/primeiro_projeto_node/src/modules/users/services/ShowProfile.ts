import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ShowProfile {
  private _repository: IUserRepository;

  constructor(@inject('UsersRepository') repository: IUserRepository) {
    this._repository = repository;
  }

  async execute({ user_id }: IRequest): Promise<User | undefined> {
    const user = await this._repository.findById(user_id);

    if (!user) {
      throw new AppError('User not found!', 404);
    }

    return user;
  }
}
