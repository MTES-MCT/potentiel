import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  AvailableChangementReprésentantLégalAction,
  DétailsChangementReprésentantLégalPage,
} from '@/components/pages/représentant-légal/changement/détails/DétailsChangementReprésentantLégal.page';
import { mapToReprésentantLégalTimelineItemProps } from '@/utils/historique/mapToProps/représentant-légal/mapToReprésentantLégalTimelineItemProps';

export const metadata: Metadata = {
  title: 'Détail du représentant légal du projet - Potentiel',
  description: "Détail du représentant légal d'un projet",
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

      const changement =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            demandéLe,
          },
        });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const représentantLégal =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const historique =
        await mediator.send<Lauréat.ReprésentantLégal.ListerHistoriqueReprésentantLégalProjetQuery>(
          {
            type: 'Lauréat.ReprésentantLégal.Query.ListerHistoriqueReprésentantLégalProjet',
            data: {
              identifiantProjet: identifiantProjet.formatter(),
            },
          },
        );

      const dateDemandeEnCoursPourLien =
        Option.isSome(représentantLégal) &&
        représentantLégal.demandeEnCours &&
        représentantLégal.demandeEnCours.demandéLe !== demandéLe
          ? représentantLégal.demandeEnCours.demandéLe
          : undefined;

      return (
        <DétailsChangementReprésentantLégalPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(changement.demande)}
          role={mapToPlainObject(utilisateur.role)}
          actions={mapToActions(utilisateur.role, changement.demande.statut)}
          historique={historique.items.map(mapToReprésentantLégalTimelineItemProps)}
          dateDemandeEnCoursPourLien={dateDemandeEnCoursPourLien}
        />
      );
    }),
  );
}

const mapToActions = (
  role: Role.ValueType,
  statut: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['statut'],
) => {
  const actions: Array<AvailableChangementReprésentantLégalAction> = [];

  if (statut.estDemandé()) {
    if (role.aLaPermission('représentantLégal.accorderChangement')) {
      actions.push('accorder');
    }
    if (role.aLaPermission('représentantLégal.rejeterChangement')) {
      actions.push('rejeter');
    }
    if (role.aLaPermission('représentantLégal.annulerChangement')) {
      actions.push('annuler');
    }
    if (role.aLaPermission('représentantLégal.corrigerChangement')) {
      actions.push('corriger');
    }
  }
  return actions;
};
