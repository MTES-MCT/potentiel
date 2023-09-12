import { EnvoyerEmailPort } from '@potentiel/domain';
import { sendEmail } from '@potentiel/email-sender';

class TemplateEmailInexistant extends Error {
  constructor(type: string) {
    super(`Le template de mail ${type} n'existe pas`);
  }
}

export const envoyerEmailAdapter: EnvoyerEmailPort = async (props) => {
  if (!props.templateId) {
    throw new TemplateEmailInexistant(props.type);
  }

  const { templateId, message, variables } = props;

  await sendEmail({
    templateId,
    message,
    variables,
  });
};
