import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Accès } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';

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
      const identifiantUtilisateurs = accèsProjet.utilisateursAyantAccès.map((utilisateur) =>
        utilisateur.formatter(),
      );

      const utilisateurs = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          identifiantUtilisateurs,
        },
      });

      return utilisateurs.items.map(({ email, nomComplet }) => ({
        email,
        fullName: Option.match(nomComplet)
          .some((nomComplet) => nomComplet)
          .none(() => ''),
      }));
    })
    .none(async () => []);
};
