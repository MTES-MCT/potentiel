import { EnvoyerEmailPort } from '@potentiel/domain';
import { sendEmail } from '@potentiel/email-sender';

export const envoyerEmailAdapter: EnvoyerEmailPort = async (props) => {
  await sendEmail(props);
};
