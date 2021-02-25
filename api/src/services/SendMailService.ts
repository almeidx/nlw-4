import { readFileSync } from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

class SendMailService {
  private client: Transporter;

  public constructor() {
    void nodemailer.createTestAccount().then(({ pass, smtp, user }) => {
      this.client = nodemailer.createTransport({
        auth: { pass, user },
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
      });
    });
  }

  public async execute(to: string, subject: string, variables: Record<string, unknown>, path: string) {
    const templateFileContent = readFileSync(path).toString('utf-8');

    const mailTemplate = handlebars.compile(templateFileContent);
    const html = mailTemplate(variables);

    const message = await this.client.sendMail({
      from: 'NPS <noreply@nps.com.br>',
      html,
      subject,
      to,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
