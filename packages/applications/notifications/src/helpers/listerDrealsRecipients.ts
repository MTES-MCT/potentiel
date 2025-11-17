import { mediator } from 'mediateur';

import { ListerUtilisateursQuery, Role } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

export const listerDrealsRecipients = async (région: string): Promise<Recipient[]> => {
  const dreals = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: { roles: [Role.dreal.nom], région, actif: true },
  });
  return dreals.items.map(({ identifiantUtilisateur: { email } }) => ({ email }));
};
