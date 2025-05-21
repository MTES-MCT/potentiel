import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Accès } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { Recipient } from '../sendEmail';

export const listerPorteursRecipients = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Recipient[]> => {
  const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
    type: 'Projet.Accès.Query.ConsulterAccès',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  return Option.match(accèsProjet)
    .some(async (accèsProjet) => {
      const identifiantsUtilisateur = accèsProjet.utilisateursAyantAccès.map((utilisateur) =>
        utilisateur.formatter(),
      );

      return identifiantsUtilisateur.map((email) => ({
        email,
      }));
    })
    .none(async () => []);
};
