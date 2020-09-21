import { container } from 'tsyringe';

import IStoregeProvider from './StorageProviders/models/IStorageProvider';
import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';

container.registerSingleton<IStoregeProvider>(
  'StorageProvider',
  DiskStorageProvider
);
