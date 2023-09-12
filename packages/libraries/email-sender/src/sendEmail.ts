import { getClient } from './getClient';

type SendEmailProps = {
  templateId: number;
  message: {
    objet: string;
    destinataires: { email: string; name: string }[];
  };
  variables: Record<string, string>;
};

export const sendEmail = async (props: SendEmailProps) => {
  try {
    const {
      templateId,
      message: { objet, destinataires },
      variables,
    } = props;

    const result = await getClient()
      .post('send', {
        version: 'v3.1',
      })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.SEND_EMAILS_FROM,
              Name: process.env.SEND_EMAILS_FROM_NAME,
            },
            To: destinataires.map(({ email, name }) => ({
              Email: email,
              Name: name,
            })),
            TemplateID: templateId,
            TemplateLanguage: true,
            Subject: objet,
            Variables: variables,
          },
        ],
      });

    console.log(result);
  } catch (e) {
    console.error(e);
  }
};
