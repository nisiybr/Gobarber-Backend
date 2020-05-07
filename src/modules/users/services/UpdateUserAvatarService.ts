import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';

import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

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
      // Se ja tem avatar, deletar o anterior
      const userAvataFilePath = path.join(uploadConfig.directory, user.avatar);
      // Stats traz as informações do arquivo, se ele existir
      const userAvatarExists = await fs.promises.stat(userAvataFilePath);
      // Se o arquivo existe
      if (userAvatarExists) {
        fs.promises.unlink(userAvataFilePath);
      }
    }

    user.avatar = avatarFilename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
