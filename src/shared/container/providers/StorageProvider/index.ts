import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import S3DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/S3DiskStorageProvider';





const providers =  {
  disk: DiskStorageProvider,
  s3: S3DiskStorageProvider,
}
container.registerSingleton<IStorageProvider>(
  'DiskStorageProvider',
  providers[uploadConfig.driver],
);
