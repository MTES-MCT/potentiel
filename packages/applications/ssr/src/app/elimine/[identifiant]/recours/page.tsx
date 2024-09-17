import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Recours } from '@potentiel-domain/elimine';
import { Role } from '@potentiel-domain/utilisateur';
import { featureFlags } from '@potentiel-applications/feature-flags';
import { getLogger } from '@potentiel-libraries/monitoring';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  AvailableRecoursAction,
  DétailsRecoursPage,
} from '@/components/pages/recours/détails/DétailsRecours.page';

type PageProps = IdentifiantParameter;

/**
 *
 * @todo afficher le nom du projet dans le title de la page
 */
export const metadata: Metadata = {
  title: 'Détail recours projet - Potentiel',
  description: "Détail du recours d'un projet",
};

export default async function Page({ params: { identifiant } }: PageProps) {
  if (!featureFlags.isRecoursEnabled) {
    getLogger().warn('Feature flags "Recours" disabled');
    return notFound();
  }

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(recours)) {
        return notFound();
      }

      return (
        <DétailsRecoursPage
          recours={mapToPlainObject(recours)}
          identifiantProjet={identifiantProjet}
          role={mapToPlainObject(utilisateur.role)}
          actions={mapToActions({
            role: utilisateur.role.nom,
            statut: recours.statut.value,
          })}
        />
      );
    }),
  );
}

type MapToActionsProps = {
  role: Role.RawType;
  statut: Recours.StatutRecours.RawType;
};

const mapToActions = (props: MapToActionsProps) =>
  match(props)
    .returnType<ReadonlyArray<AvailableRecoursAction>>()
    .with(
      {
        role: 'admin',
        statut: 'demandé',
      },
      () => ['accorder', 'rejeter'],
    )
    .with(
      {
        role: 'dgec-validateur',
        statut: 'demandé',
      },
      () => ['accorder', 'rejeter'],
    )
    .with(
      {
        role: 'porteur-projet',
        statut: 'demandé',
      },
      () => ['annuler'],
    )
    .otherwise(() => []);
