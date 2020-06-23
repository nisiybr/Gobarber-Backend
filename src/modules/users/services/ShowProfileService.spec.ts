import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile of an existent user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Guilherme Nisiyama');
    expect(profile.email).toBe('teste@teste.com.br');
  });
  it('should not be able to show the profile of an inexistent user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'inexistent_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
