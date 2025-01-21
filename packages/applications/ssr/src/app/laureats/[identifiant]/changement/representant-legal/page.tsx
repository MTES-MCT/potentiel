import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

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
      const identifiantChangement = decodeParameter(identifiant);

      const changement =
        await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantChangement,
          },
        });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const actions: Array<AvailableChangementReprésentantLégalAction> = [];

      if (changement.demande.statut.estDemandé()) {
        if (utilisateur.role.aLaPermission('représentantLégal.accorderChangement')) {
          actions.push('accorder');
        }
        if (utilisateur.role.aLaPermission('représentantLégal.rejeterChangement')) {
          actions.push('rejeter');
        }
        if (utilisateur.role.aLaPermission('représentantLégal.annulerChangement')) {
          actions.push('annuler');
        }
      }

      return (
        <DétailsChangementReprésentantLégalPage
          identifiantProjet={mapToPlainObject(changement.identifiantProjet)}
          identifiantChangement={changement.identifiantChangement}
          demande={mapToPlainObject(changement.demande)}
          role={mapToPlainObject(utilisateur.role)}
          actions={actions}
        />
      );
    }),
  );
}
