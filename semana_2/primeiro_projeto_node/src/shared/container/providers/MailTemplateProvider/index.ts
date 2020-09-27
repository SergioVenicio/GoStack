import { container } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplate from '../MailTemplateProvider/implementations/HandlebarsMailTemplate';

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplate
);
