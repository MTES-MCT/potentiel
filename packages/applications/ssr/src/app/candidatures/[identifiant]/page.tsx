import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getCandidature } from '@/app/_helpers';
import { DétailsCandidaturePage } from '@/app/candidatures/[identifiant]/DétailsCandidature.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getCandidatureActions } from '../_helpers/getCandidatureActions';

type PageProps = IdentifiantParameter;

export default async function Page(props: PageProps) {
  const params = await props.params;
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
            utilisateur.rôle,
          )}
        />
      );
    }),
  );
}
