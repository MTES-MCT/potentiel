import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ListerPorteursQuery } from '@potentiel-domain/utilisateur';

import { Recipient } from '../sendEmail';

export const listerPorteursRecipients = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Recipient[]> => {
  const porteurs = await mediator.send<ListerPorteursQuery>({
    type: 'Utilisateur.Query.ListerPorteurs',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });
  return porteurs.items.map(({ identifiantUtilisateur: { email } }) => ({ email }));
};
