import { mediator } from 'mediateur';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Éliminé } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Historique } from '@potentiel-domain/historique';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  AvailableRecoursAction,
  DétailsRecoursPage,
} from '@/components/pages/recours/détails/DétailsRecours.page';

import { getCandidature } from '../../../candidatures/_helpers/getCandidature';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);
  const candidature = await getCandidature(identifiantProjet);

  return {
    title: `Détails du recours du projet ${candidature.nomProjet} - Potentiel`,
    description: "Détail du recours d'un projet",
  };
}

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(recours)) {
        return notFound();
      }

      const historique = await mediator.send<Historique.ListerHistoriqueProjetQuery>({
        type: 'Historique.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet,
          category: 'recours',
        },
      });

      return (
        <DétailsRecoursPage
          recours={mapToPlainObject(recours)}
          identifiantProjet={identifiantProjet}
          actions={mapToActions({
            role: utilisateur.role.nom,
            statut: recours.statut.value,
          })}
          historique={mapToPlainObject(historique)}
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
