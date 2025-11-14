import { Metadata, ResolvingMetadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';
import { DétailsRecoursPage } from '@/app/elimines/(liste)/[identifiant]/recours/(détails)/DétailsRecours.page';
import { mapToRecoursTimelineItemProps } from '@/app/elimines/(liste)/[identifiant]/recours/(historique)/mapToRecoursTimelineItemProps';

import { getLauréatInfos } from '../_helpers/getLauréat';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const identifiantProjet = decodeParameter(params.identifiant);
    const lauréat = await getLauréatInfos({ identifiantProjet });

    return {
      title: `Détails du recours du projet ${lauréat.nomProjet} - Potentiel`,
      description: "Détail du recours d'un projet",
    };
  } catch {
    return {};
  }
}

/**
 * Cette page est globalement identique à elimines/[identifiant]/recours mais est dans la route Lauréat afin d'afficher la bonne banière projet
 **/
export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);

      const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(recours) || !recours.statut.estAccordé()) {
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
          actions={[]}
          historique={historique.items.map(mapToRecoursTimelineItemProps)}
        />
      );
    }),
  );
}
