import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import {
  ChangementPuissanceActions,
  DétailsPuissancePage,
} from '@/components/pages/puissance/changement/détails/DétailsPuissance.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { mapToPuissanceTimelineItemProps } from '@/utils/historique/mapToProps/puissance/mapToPuissanceTimelineItemProps';

export const metadata: Metadata = {
  title: 'Détail de la puissance du projet - Potentiel',
  description: 'Détail de la puissance du projet',
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

      const changement = await mediator.send<Lauréat.Puissance.ConsulterChangementPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe,
        },
      });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(puissance)) {
        return notFound();
      }

      const candidature = await getCandidature(identifiantProjet.formatter());

      const historique =
        await mediator.send<Lauréat.Puissance.ListerHistoriquePuissanceProjetQuery>({
          type: 'Lauréat.Puissance.Query.ListerHistoriquePuissanceProjet',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      return (
        <DétailsPuissancePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(changement.demande)}
          puissanceInitiale={candidature.puissanceProductionAnnuelle}
          unitéPuissance={candidature.unitéPuissance.formatter()}
          historique={historique.items.map((item) =>
            mapToPuissanceTimelineItemProps(item, candidature.unitéPuissance.formatter()),
          )}
          actions={mapToActions(
            changement.demande.statut,
            utilisateur.role,
            changement.demande.autoritéCompétente?.autoritéCompétente,
          )}
          demandeEnCoursDate={
            puissance.dateDemandeEnCours ? puissance.dateDemandeEnCours.formatter() : undefined
          }
        />
      );
    }),
  );
}

const mapToActions = (
  statut: Lauréat.Puissance.StatutChangementPuissance.ValueType,
  rôle: Role.ValueType,
  autoritéCompétente?: Lauréat.Puissance.AutoritéCompétente.RawType,
): Array<ChangementPuissanceActions> => {
  const actions: Array<ChangementPuissanceActions> = [];

  if (statut.estDemandé()) {
    const estAutoritéCompétente =
      (autoritéCompétente === 'dreal' && rôle.nom === 'dreal') ||
      rôle.nom === 'dgec-validateur' ||
      rôle.nom === 'admin';

    if (rôle.aLaPermission('puissance.accorderChangement') && estAutoritéCompétente) {
      actions.push('accorder');
    }
    if (rôle.aLaPermission('puissance.rejeterChangement') && estAutoritéCompétente) {
      actions.push('rejeter');
    }
    if (rôle.aLaPermission('puissance.annulerChangement')) {
      actions.push('annuler');
    }
  }

  return actions;
};
