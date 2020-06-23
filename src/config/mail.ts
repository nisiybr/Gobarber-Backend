interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from:{
      email: 'guilherme@learningnewtechs.com',
      name: 'Guilherme da Learning New Techs',
    }
  }
} as IMailConfig;

	
