import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  AvailableChangementReprésentantLégalAction,
  DétailsChangementReprésentantLégalPage,
} from '@/components/pages/représentant-légal/changement/détails/DétailsChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Détail du représentant légal du projet - Potentiel',
  description: "Détail du représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const changement =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const actions: Array<AvailableChangementReprésentantLégalAction> = [];

      if (
        (utilisateur.role.estÉgaleÀ(Role.admin) || utilisateur.role.estÉgaleÀ(Role.dreal)) &&
        changement.demande.statut.estDemandé()
      ) {
        actions.push('accorder');
      }

      return (
        <DétailsChangementReprésentantLégalPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(changement.demande)}
          role={mapToPlainObject(utilisateur.role)}
          actions={actions}
        />
      );
    }),
  );
}
