import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUser from '@modules/users/dtos/ICreateUser';
import IFindProviderDTO from '../dtos/IFindProvidersDTO';

export default interface IUsersRepository {
  findAll(data: IFindProviderDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(user: ICreateUser): Promise<User>;
  save(user: User): Promise<User>;
}
