import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToReprésentantLégalTimelineItemProps } from '@/utils/historique/mapToProps/représentant-légal/mapToReprésentantLégalTimelineItemProps';

import { récupérerChangementsPermisParLeCahierDesCharges } from '../../../../../../_helpers/récupérerChangementsPermisParLeCahierDesCharges';

import {
  AvailableChangementReprésentantLégalAction,
  DétailsChangementReprésentantLégalPage,
} from './DétailsChangementReprésentantLégal.page';

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
      const { demande, informationEnregistrée } =
        await récupérerChangementsPermisParLeCahierDesCharges(
          identifiantProjet,
          'représentantLégal',
        );

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
          actions={mapToActions(
            utilisateur.role,
            changement.demande.statut,
            demande,
            informationEnregistrée,
          )}
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
  demande: boolean,
  informationEnregistrée: boolean,
) => {
  const actions: Array<AvailableChangementReprésentantLégalAction> = [];
  if (!statut.estDemandé() && informationEnregistrée) {
    if (role.aLaPermission('représentantLégal.enregistrerChangement')) {
      actions.push('enregistrer-changement');
    }
  }

  if (statut.estDemandé() && demande) {
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
