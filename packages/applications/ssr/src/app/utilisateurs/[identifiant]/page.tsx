import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  ConsulterUtilisateurQuery,
  ListerPorteursQuery,
  Role,
} from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { PorteurListPage } from '@/components/pages/utilisateur/lister/PorteurList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { withUtilisateur } from '../../../utils/withUtilisateur';

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

      const utilisateurs = await mediator.send<ListerPorteursQuery>({
        type: 'Utilisateur.Query.ListerPorteurs',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      return (
        <PorteurListPage
          identifiantProjet={identifiantProjet.formatter()}
          nombreDeProjets={nombreDeProjets}
          items={mapToPlainObject(utilisateurs.items)}
        />
      );
    }),
  );
}
