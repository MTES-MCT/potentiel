import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Puissance } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { Historique } from '@potentiel-domain/historique';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import {
  ChangementPuissanceActions,
  DétailsPuissancePage,
} from '@/components/pages/puissance/changement/détails/DétailsPuissance.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { PuissanceHistoryRecord } from '@/components/molecules/historique/timeline/puissance';

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

      const changement = await mediator.send<Puissance.ConsulterChangementPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe,
        },
      });

      if (Option.isNone(changement)) {
        return notFound();
      }

      const puissance = await mediator.send<Puissance.ConsulterPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(puissance)) {
        return notFound();
      }

      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: identifiantProjet.appelOffre,
        },
      });

      if (Option.isNone(appelOffre)) {
        return notFound();
      }

      const historique = await mediator.send<
        Historique.ListerHistoriqueProjetQuery<PuissanceHistoryRecord>
      >({
        type: 'Historique.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          category: 'puissance',
        },
      });

      const historiqueWithUnitePuissance = {
        ...historique,
        items: historique.items.map((historique) => ({
          ...historique,
          unitePuissance: appelOffre.unitePuissance,
        })),
      };

      return (
        <DétailsPuissancePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          demande={mapToPlainObject(changement.demande)}
          historique={mapToPlainObject(historiqueWithUnitePuissance)}
          actions={mapToActions(
            changement.demande.statut,
            utilisateur.role,
            !changement.demande.isInformationEnregistrée
              ? changement.demande.autoritéCompétente
              : undefined,
          )}
          demandeEnCoursDate={
            puissance.dateDemandeEnCours ? puissance.dateDemandeEnCours.formatter() : undefined
          }
          unitePuissance={appelOffre.unitePuissance}
        />
      );
    }),
  );
}

const mapToActions = (
  statut: Puissance.StatutChangementPuissance.ValueType,
  rôle: Role.ValueType,
  autoritéCompétente?: Puissance.RatioChangementPuissance.AutoritéCompétente,
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
