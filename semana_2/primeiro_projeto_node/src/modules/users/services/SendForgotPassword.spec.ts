import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProviders/fakes/FakeMailProvider';
import SendForgotPassword from './SendForgotPassword';

let repository: FakeUserTokensRepository;
let userRepository: FakeUsersRepository;
let mailProvider: FakeMailProvider;
let service: SendForgotPassword;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    repository = new FakeUserTokensRepository();
    userRepository = new FakeUsersRepository();
    mailProvider = new FakeMailProvider();
    service = new SendForgotPassword(repository, userRepository, mailProvider);
  });

  it('should be able to send a forgot password email', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    const user = await userRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await service.execute({
      email: user.email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send a forgot password to a non-existent user', async () => {
    await expect(
      service.execute({ email: 'fake@email.com' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(repository, 'generate');

    const user = await userRepository.create({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });

    await service.execute({
      email: user.email,
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
