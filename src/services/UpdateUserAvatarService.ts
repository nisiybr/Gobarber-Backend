import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import User from '../models/Users';

import AppError from '../errors/AppError';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

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

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
