import { EnvoyerEmailPort } from '@potentiel/domain';

export const envoyerEmailAdapter: EnvoyerEmailPort = async ({
  type,
  contexte,
  message,
  variables,
}) => {
  console.log('LOOK IM HERE', {
    type,
    contexte,
    message,
    variables,
  });
  // TODO : Connecter avec la méthode sendEmail du package
};
