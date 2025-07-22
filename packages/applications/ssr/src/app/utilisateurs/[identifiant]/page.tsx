import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Accès } from '@potentiel-domain/projet';
import {
  ListerPorteursQuery,
  ListerPorteursReadModel,
  Utilisateur,
} from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { PorteurListPage } from './PorteurList.page';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const nombreDeProjets = await getNombreProjets(utilisateur);

      const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
        type: 'Projet.Accès.Query.ConsulterAccès',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const utilisateurs: ListerPorteursReadModel['items'] = await Option.match(accèsProjet)
        .some(async (accèsProjet) => {
          const identifiantsUtilisateur = accèsProjet.utilisateursAyantAccès.map((utilisateur) =>
            utilisateur.formatter(),
          );

          const utilisateurs = await mediator.send<ListerPorteursQuery>({
            type: 'Utilisateur.Query.ListerPorteurs',
            data: {
              identifiantsUtilisateur,
            },
          });

          return utilisateurs.items;
        })
        .none(async () => []);

      return (
        <PorteurListPage
          identifiantProjet={identifiantProjet.formatter()}
          nombreDeProjets={nombreDeProjets}
          items={mapToProps(utilisateurs, utilisateur)}
        />
      );
    }),
  );
}

const mapToProps = (
  utilisateurs: ListerPorteursReadModel['items'],
  utilisateurQuiInvite: Utilisateur.ValueType,
) =>
  mapToPlainObject(
    utilisateurs.map((utilisateur) => ({
      ...utilisateur,
      peutRetirerAccès: !utilisateur.identifiantUtilisateur.estÉgaleÀ(
        utilisateurQuiInvite.identifiantUtilisateur,
      ),
    })),
  );

const getNombreProjets = async (utilisateur: Utilisateur.ValueType) => {
  if (!utilisateur.role.estPorteur()) {
    return undefined;
  }
  const accès = await mediator.send<Accès.ListerAccèsQuery>({
    type: 'Projet.Accès.Query.ListerAccès',
    data: {
      identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      range: {
        startPosition: 0,
        endPosition: 1,
      },
    },
  });

  return accès.total;
};
