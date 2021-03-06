// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile of an existent user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Guilherme Nisiyama de Jesus',
      email: 'guilherme.nisiyama@hotmail.com',
    });

    expect(updatedUser.name).toBe('Guilherme Nisiyama de Jesus');
    expect(updatedUser.email).toBe('guilherme.nisiyama@hotmail.com');
  });
  it('should not be able to update the profile of an inexistent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'inexistent_id',
        name: 'Guilherme Nisiyama de Jesus',
        email: 'guilherme.nisiyama@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the user email to an email already in use', async () => {
    await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste2@teste.com.br',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: user.name,
        email: 'teste@teste.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Guilherme Nisiyama de Jesus',
      email: 'guilherme.nisiyama@hotmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });
  it('should be not able to update the password without inform old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Guilherme Nisiyama de Jesus',
        email: 'guilherme.nisiyama@hotmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be not able to update the password if old password is wrong', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Guilherme Nisiyama de Jesus',
        email: 'guilherme.nisiyama@hotmail.com',
        old_password: 'wrong_password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
