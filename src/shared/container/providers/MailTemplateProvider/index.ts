import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailTemplateProvider from './models/IMailTemplateProvider';

import HandleBarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandleBarsMailTemplateProvider';





const providers =  {
  handlebars: HandleBarsMailTemplateProvider,
}
container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
