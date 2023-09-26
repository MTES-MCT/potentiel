import { getMailjetClient } from './getMailjetClient';

type SendEmail = (email: {
  templateId: string;
  messageSubject: string;
  recipients: { email: string; fullName: string }[];
  variables: Record<string, string>;
}) => Promise<void>;

export const sendEmail: SendEmail = async ({
  templateId,
  messageSubject,
  recipients,
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
          To: recipients.map(({ email, fullName }) => ({
            Email: email,
            Name: fullName,
          })),
          TemplateID: templateId,
          TemplateLanguage: true,
          Subject: messageSubject,
          Variables: variables,
        },
      ],
    });
};
