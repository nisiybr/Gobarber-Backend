import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Guilherme Nisiyama');
    expect(user.email).toBe('teste@teste.com.br');
  });
  it('should not be able to create a user with email that already exists', async () => {
    await createUser.execute({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Guilherme Nisiyama',
        email: 'teste@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
