import { mediator } from 'mediateur';
import type { Metadata, ResolvingMetadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getCandidature } from '@/app/_helpers';
import { DétailsCandidaturePage } from '@/app/candidatures/[identifiant]/DétailsCandidature.page';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidatureActions } from '../_helpers/getCandidatureActions';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const identifiantProjet = decodeParameter(params.identifiant);
    const candidature = await getCandidature(identifiantProjet);

    return {
      title: `Candidature ${candidature.dépôt.nomProjet} - Potentiel`,
      description: 'Détails de la candidature',
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(params.identifiant);
      const candidature = await getCandidature(identifiantProjet);
      const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
        type: 'Lauréat.Query.ConsulterLauréat',
        data: {
          identifiantProjet,
        },
      });
      return (
        <DétailsCandidaturePage
          candidature={mapToPlainObject(candidature)}
          actions={getCandidatureActions(
            {
              estNotifiée: !!candidature.notification,
              aUneAttestation: !!candidature.notification?.attestation,
              estLauréat: Option.isSome(lauréat),
            },
            utilisateur.role,
          )}
        />
      );
    }),
  );
}
