import { TemplateEmailType } from '@potentiel/domain';
import { TemplateEmailInexistant } from './emailSender.errors';
import { getClient } from './getClient';

const TEMPLATE_ID_BY_TYPE: Record<TemplateEmailType, number> = {
  'notifier-pp-gf-validé': 111111111,
};

type sendEmailProps = {
  type: TemplateEmailType;
  contexte: {
    identifiantProjet: string;
  };
  message: {
    objet: string;
    destinataires: { email: string; name: string }[];
  };
  variables: Record<string, string>;
};

export const sendEmail = async (props: sendEmailProps) => {
  try {
    const {
      type,
      message: { objet, destinataires },
      variables,
    } = props;

    const templateId = TEMPLATE_ID_BY_TYPE[type];

    if (!templateId) {
      throw new TemplateEmailInexistant(type);
    }

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
