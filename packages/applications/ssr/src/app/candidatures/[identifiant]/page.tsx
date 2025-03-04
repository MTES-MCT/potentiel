import { Metadata, ResolvingMetadata } from 'next';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { DétailsCandidaturePage } from '@/components/pages/candidature/détails/DétailsCandidature.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getCandidature } from '../_helpers/getCandidature';
import { getCandidatureActions } from '../_helpers/getCandidatureActions';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);
  const candidature = await getCandidature(identifiantProjet);

  return {
    title: `Candidature ${candidature.nomProjet} - Potentiel`,
    description: 'Détails de la candidature',
  };
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
