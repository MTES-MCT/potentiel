import { mediator } from 'mediateur';

import { ListerUtilisateursQuery, Role } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

export const listerAdminRecipients = async (): Promise<Recipient[]> => {
  const admins = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: { roles: [Role.admin.nom], actif: true },
  });
  return admins.items.map(({ identifiantUtilisateur: { email } }) => ({ email }));
};
