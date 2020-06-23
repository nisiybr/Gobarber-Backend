// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;
describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Provider 1',
      email: 'provider1@teste.com.br',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'Provider 2',
      email: 'provider2@teste.com.br',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Guilherme Nisiyama',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const profile = await listProvidersService.execute({ user_id: user.id });

    expect(profile.length).toBe(2);
    expect(profile).toEqual([user1, user2]);
  });
});
