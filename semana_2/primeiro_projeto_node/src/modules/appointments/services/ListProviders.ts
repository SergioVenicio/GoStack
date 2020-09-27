import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICacheProvider from '@shared/container/providers/CacheProviders/models/ICacheProvider';

import User from '@modules/users/infra/typeorm/entities/User';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProviders {
  private _repository: IUserRepository;
  private _cache: ICacheProvider;

  constructor(
    @inject('UsersRepository') repository: IUserRepository,
    @inject('CacheProvider') cache: ICacheProvider
  ) {
    this._repository = repository;
    this._cache = cache;
  }

  async execute({ user_id }: IRequest): Promise<User[]> {
    const cachedUsers = await this._cache.recover<User[]>(
      `providers-list:${user_id}`
    );

    if (cachedUsers !== null) {
      return cachedUsers;
    }

    const providerData = await this._repository.findAll({
      except_user_id: user_id,
    });

    await this._cache.save<User[]>(
      `providers-list:${user_id}`,
      classToClass(providerData)
    );
    return providerData;
  }
}
