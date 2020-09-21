import { v4 } from 'uuid';
import validate from 'uuid-validate';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import ICreateUser from '@modules/users/dtos/ICreateUser';

export default class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, {
      id: v4(),
      name,
      email,
      password,
    });

    await this.save(newUser);
    return newUser;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex((dbUser) => dbUser.id === user.id);

    if (userIndex !== -1) {
      this.users[userIndex] = user;
    } else {
      this.users.push(user);
    }

    return user;
  }

  public async find(): Promise<User[] | undefined> {
    return this.users;
  }

  public async findById(id: string): Promise<User | undefined> {
    if (!validate(id)) {
      return;
    }

    return this.users.find((user) => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
