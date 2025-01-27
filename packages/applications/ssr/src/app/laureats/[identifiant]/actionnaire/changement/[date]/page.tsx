import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { AvailableChangementReprésentantLégalAction } from '@/components/pages/représentant-légal/changement/détails/DétailsChangementReprésentantLégal.page';

import { DétailsActionnairePage } from '../../../../../../components/pages/actionnaire/changement/détails/DétailsActionnaire.page';

export const metadata: Metadata = {
  title: "Détail de l'actionnariat du projet - Potentiel",
  description: "Détail de l'actionnariat du projet",
};

type PageProps = {
  params: {
    identifiant: string;
    date: string;
  };
};

export default async function Page({ params: { identifiant, date } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const demandéLe = decodeParameter(date);

      const changement = await mediator.send<Actionnaire.ConsulterChangementActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe,
        },
      });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const actions: Array<AvailableChangementReprésentantLégalAction> = [];

      if (changement.demande.statut.estDemandé()) {
        if (utilisateur.role.aLaPermission('actionnaire.accorderChangement')) {
          actions.push('accorder');
        }
        if (utilisateur.role.aLaPermission('actionnaire.rejeterChangement')) {
          actions.push('rejeter');
        }
        if (utilisateur.role.aLaPermission('actionnaire.annulerChangement')) {
          actions.push('annuler');
        }
      }

      const historique = await mediator.send<Historique.ListerHistoriqueProjetQuery>({
        type: 'Historique.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          category: 'actionnaire',
        },
      });

      return (
        <DétailsActionnairePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(changement.demande)}
          actions={actions}
          historique={mapToPlainObject(historique)}
        />
      );
    }),
  );
}
