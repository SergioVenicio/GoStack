import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';
import User, { UserInterface } from '../models/User';

type UserAuthPayload = Pick<UserInterface, 'email' | 'password'>;

class AuthenticateUser {
  async execute({ email, password }: UserAuthPayload): Promise<string> {
    const repository = getRepository(User);
    const user = await repository.findOne({
      where: { email },
    });

    if (!user || !(await compare(password, user.password))) {
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
    return token;
  }
}

export default AuthenticateUser;
