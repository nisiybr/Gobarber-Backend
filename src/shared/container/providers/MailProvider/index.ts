import { container } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
// import MailProvider from '@shared/container/providers/MailProvider/implementations/MailProvider';

container.registerSingleton<IMailProvider>('MailProvider', MailProvider);
