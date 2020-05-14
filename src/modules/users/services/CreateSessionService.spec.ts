import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let createSession: CreateSessionService;
describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to create a new session', async () => {
    const user = await createUser.execute({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const response = await createSession.execute({
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with email that does not exists', async () => {
    await expect(
      createSession.execute({
        email: 'teste2@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });
    await expect(
      createSession.execute({
        email: 'teste@teste.com.br',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
