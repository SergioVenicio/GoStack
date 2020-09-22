import { getRepository, Repository } from 'typeorm';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
  private _repository: IUserTokensRepository<UserToken>;

  constructor() {
    this._repository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this._repository.create({ user_id });

    await this._repository.save(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return await this._repository.findOne({
      where: { token },
    });
  }
}

export default UserTokensRepository;
