import { getMailjetClient } from './getMailjetClient';

type SendEmail = (email: {
  templateId: number;
  message: {
    object: string;
    recipients: { email: string; name: string }[];
  };
  variables: Record<string, string>;
}) => Promise<void>;

export const sendEmail: SendEmail = async ({
  templateId,
  message: { object, recipients },
  variables,
}) => {
  const { SEND_EMAILS_FROM, SEND_EMAILS_FROM_NAME } = process.env;

  await getMailjetClient()
    .post('send', {
      version: 'v3.1',
    })
    .request({
      Messages: [
        {
          From: {
            Email: SEND_EMAILS_FROM,
            Name: SEND_EMAILS_FROM_NAME,
          },
          To: recipients.map(({ email, name }) => ({
            Email: email,
            Name: name,
          })),
          TemplateID: templateId,
          TemplateLanguage: true,
          Subject: object,
          Variables: variables,
        },
      ],
    });
};
