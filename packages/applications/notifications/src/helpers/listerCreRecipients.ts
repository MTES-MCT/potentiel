import { mediator } from 'mediateur';

import { ListerUtilisateursQuery, Role } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

export const listerCreRecipients = async (): Promise<Recipient[]> => {
  const dreals = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: { roles: [Role.cre.nom], actif: true },
  });
  return dreals.items.map(({ identifiantUtilisateur: { email } }) => ({ email }));
};
