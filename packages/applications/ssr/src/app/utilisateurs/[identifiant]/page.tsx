import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  ConsulterUtilisateurQuery,
  ConsulterUtilisateurReadModel,
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
  Role,
} from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Accès } from '@potentiel-domain/projet';

import { PorteurListPage } from '@/components/pages/utilisateur/lister/PorteurList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const utilisateurQuiInvite = await mediator.send<ConsulterUtilisateurQuery>({
        type: 'Utilisateur.Query.ConsulterUtilisateur',
        data: {
          identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
        },
      });

      if (Option.isNone(utilisateurQuiInvite)) {
        return notFound();
      }

      const nombreDeProjets =
        utilisateurQuiInvite.rôle.estÉgaleÀ(Role.porteur) &&
        Option.isSome(utilisateurQuiInvite.nombreDeProjets)
          ? utilisateurQuiInvite.nombreDeProjets
          : undefined;

      const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
        type: 'Projet.Accès.Query.ConsulterAccès',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const utilisateurs: ListerUtilisateursReadModel['items'] = await Option.match(accèsProjet)
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

          return utilisateurs.items;
        })
        .none(async () => []);

      return (
        <PorteurListPage
          identifiantProjet={identifiantProjet.formatter()}
          nombreDeProjets={nombreDeProjets}
          items={mapToProps(utilisateurs, utilisateurQuiInvite)}
        />
      );
    }),
  );
}

const mapToProps = (
  utilisateurs: ListerUtilisateursReadModel['items'],
  utilisateurQuiInvite: ConsulterUtilisateurReadModel,
) =>
  mapToPlainObject(
    utilisateurs.map((utilisateur) => ({
      ...utilisateur,
      peutRetirerAccès: !utilisateur.identifiantUtilisateur.estÉgaleÀ(
        utilisateurQuiInvite.identifiantUtilisateur,
      ),
    })),
  );
