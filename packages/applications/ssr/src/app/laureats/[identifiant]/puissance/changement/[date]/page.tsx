import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getPuissanceInfos } from '../../../_helpers/getLauréat';
import { mapToPuissanceTimelineItemProps } from '../../(historique)/mapToPuissanceTimelineItemProps';

import { ChangementPuissanceActions, DétailsPuissancePage } from './DétailsPuissance.page';

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

      const puissance = await getPuissanceInfos({
        identifiantProjet: identifiantProjet.formatter(),
      });

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
          puissanceInitiale={puissance.puissanceInitiale}
          unitéPuissance={puissance.unitéPuissance.formatter()}
          historique={historique.items.map((item) =>
            mapToPuissanceTimelineItemProps(item, puissance.unitéPuissance.formatter()),
          )}
          actions={mapToActions(changement.demande.statut, utilisateur.role)}
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
): Array<ChangementPuissanceActions> => {
  const actions: Array<ChangementPuissanceActions> = [];

  if (statut.estDemandé()) {
    if (rôle.aLaPermission('puissance.accorderChangement')) {
      actions.push('accorder');
    }
    if (rôle.aLaPermission('puissance.rejeterChangement')) {
      actions.push('rejeter');
    }
    if (rôle.aLaPermission('puissance.annulerChangement')) {
      actions.push('annuler');
    }
  }

  return actions;
};
