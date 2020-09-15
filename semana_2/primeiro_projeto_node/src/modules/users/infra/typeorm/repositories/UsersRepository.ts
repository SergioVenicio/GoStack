import { getRepository, Repository } from 'typeorm';
import validate from 'uuid-validate';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import ICreateUser from '@modules/users/dtos/ICreateUser';

class UsersRepository implements IUserRepository {
  private _repository: Repository<User>;

  constructor() {
    this._repository = getRepository(User);
  }

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const newUser = this._repository.create({
      name,
      email,
      password,
    });

    await this.save(newUser);
    return newUser;
  }

  public async save(user: ICreateUser): Promise<User> {
    return await this._repository.save(user);
  }

  public async find(): Promise<User[] | undefined> {
    return await this._repository.find();
  }

  public async findById(id: string): Promise<User | undefined> {
    if (!validate(id)) {
      return;
    }
    return await this._repository.findOne(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this._repository.findOne({ email });
  }
}

export default UsersRepository;
