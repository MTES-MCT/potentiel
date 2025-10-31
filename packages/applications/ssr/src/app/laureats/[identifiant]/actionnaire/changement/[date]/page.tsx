import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { mapToActionnaireTimelineItemProps } from '../../(historique)/mapToActionnaireTimelineItemProps';

import { ChangementActionnaireActions, DétailsActionnairePage } from './DétailsActionnaire.page';

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

      const changement =
        await mediator.send<Lauréat.Actionnaire.ConsulterChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            demandéLe,
          },
        });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const actionnaire = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actionnaire)) {
        return notFound();
      }

      const historique =
        await mediator.send<Lauréat.Actionnaire.ListerHistoriqueActionnaireProjetQuery>({
          type: 'Lauréat.Actionnaire.Query.ListerHistoriqueActionnaireProjet',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const dateDemandeEnCoursSiDifférente =
        actionnaire.dateDemandeEnCours &&
        !changement.demande.demandéeLe.estÉgaleÀ(actionnaire.dateDemandeEnCours)
          ? actionnaire.dateDemandeEnCours.formatter()
          : undefined;

      return (
        <DétailsActionnairePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(changement.demande)}
          actions={mapToActions(changement.demande.statut, utilisateur.rôle)}
          historique={historique.items.map(mapToActionnaireTimelineItemProps)}
          dateDemandeEnCoursSiDifférente={dateDemandeEnCoursSiDifférente}
        />
      );
    }),
  );
}

const mapToActions = (
  statut: Lauréat.Actionnaire.StatutChangementActionnaire.ValueType,
  rôle: Role.ValueType,
): Array<ChangementActionnaireActions> => {
  const actions: Array<ChangementActionnaireActions> = [];

  if (statut.estDemandé()) {
    if (rôle.aLaPermission('actionnaire.accorderChangement')) {
      actions.push('accorder');
    }
    if (rôle.aLaPermission('actionnaire.rejeterChangement')) {
      actions.push('rejeter');
    }
    if (rôle.aLaPermission('actionnaire.annulerChangement')) {
      actions.push('annuler');
    }
  }

  return actions;
};
