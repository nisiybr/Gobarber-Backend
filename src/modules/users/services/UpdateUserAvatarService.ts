import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';

import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import AppError from '@shared/errors/AppError';

import { injectable, inject } from 'tsyringe';

interface IRequestDTO {
  user_id: string;
  avatarFilename: string;
}
@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('DiskStorageProvider')
    private diskStorageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.diskStorageProvider.deleteFile(user.avatar);
    }

    const filename = await this.diskStorageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
