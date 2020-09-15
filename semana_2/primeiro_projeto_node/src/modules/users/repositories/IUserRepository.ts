import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUser from '@modules/users/dtos/ICreateUser';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(user: ICreateUser): Promise<User>;
  save(user: User): Promise<User>;
}
