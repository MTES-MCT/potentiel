import { mediator } from 'mediateur';

import { ListerUtilisateursQuery, Role, Zone } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

export const listerCocontractantRecipients = async (région: string): Promise<Recipient[]> => {
  const cocontractants = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: { roles: [Role.cocontractant.nom], zone: Zone.déterminer(région).nom, actif: true },
  });
  return cocontractants.items.map(({ identifiantUtilisateur: { email } }) => ({ email }));
};
