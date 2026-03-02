import { mediator } from 'mediateur';

import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

type ListerRecipientsProps = {
  roles: Array<string>;
  identifiantGestionnaireRéseau?: string;
  région?: string;
  zone?: string;
};

export const listerRecipients = async ({
  roles,
  identifiantGestionnaireRéseau,
  région,
  zone,
}: ListerRecipientsProps): Promise<Recipient[]> => {
  const utilisateurs = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: { roles, région, zone, identifiantGestionnaireRéseau, actif: true },
  });
  return utilisateurs.items
    .map(({ identifiantUtilisateur: { email } }) => ({ email }))
    .filter(({ email }) => !email.endsWith('@clients'));
};
