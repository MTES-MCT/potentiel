import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { mapToRecoursTimelineItemProps } from '../(historique)/mapToRecoursTimelineItemProps';

import { AvailableRecoursAction, DétailsRecoursPage } from './DétailsRecours.page';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: `Détails du recours du projet - Potentiel`,
  description: "Détail du recours d'un projet",
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(recours)) {
        return notFound();
      }

      const historique = await mediator.send<Éliminé.Recours.ListerHistoriqueRecoursProjetQuery>({
        type: 'Éliminé.Query.ListerHistoriqueRecoursProjet',
        data: {
          identifiantProjet,
        },
      });

      return (
        <DétailsRecoursPage
          recours={mapToPlainObject(recours)}
          identifiantProjet={identifiantProjet}
          actions={mapToActions({
            role: utilisateur.rôle.nom,
            statut: recours.statut.value,
          })}
          historique={historique.items.map(mapToRecoursTimelineItemProps)}
        />
      );
    }),
  );
}

type MapToActionsProps = {
  role: Role.RawType;
  statut: Éliminé.Recours.StatutRecours.RawType;
};

const mapToActions = (props: MapToActionsProps) =>
  match(props)
    .returnType<ReadonlyArray<AvailableRecoursAction>>()
    .with(
      {
        role: 'admin',
        statut: 'demandé',
      },
      {
        role: 'dgec-validateur',
        statut: 'demandé',
      },
      () => ['accorder', 'rejeter', 'passer-en-instruction'],
    )
    .with(
      {
        role: 'admin',
        statut: 'en-instruction',
      },
      {
        role: 'dgec-validateur',
        statut: 'en-instruction',
      },
      () => ['accorder', 'rejeter', 'reprendre-instruction'],
    )
    .with(
      {
        role: 'porteur-projet',
        statut: 'demandé',
      },
      {
        role: 'porteur-projet',
        statut: 'en-instruction',
      },
      () => ['annuler'],
    )
    .otherwise(() => []);
