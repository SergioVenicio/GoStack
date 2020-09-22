import { container } from 'tsyringe';

import IStoregeProvider from './StorageProviders/models/IStorageProvider';
import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';

import IMailProvider from '@shared/container/providers/MailProviders/models/IMailProvider';
import EtherealMailProvider from '../providers/MailProviders/implementations/EtherealMailProvider';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplate from '../providers/MailTemplateProvider/implementations/HandlebarsMailTemplate';

container.registerSingleton<IStoregeProvider>(
  'StorageProvider',
  DiskStorageProvider
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplate
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider)
);
