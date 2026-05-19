import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { InvalidOperationError } from '@potentiel-domain/core';
import type { Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemanderRecoursPage } from './DemanderRecours.page';

export const metadata: Metadata = { title: 'Demander un recours' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Éliminé.Recours.DemanderRecoursUseCase>(
        'Éliminé.Recours.UseCase.DemanderRecours',
      );

      const identifiantProjet = decodeParameter(identifiant);

      const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
        type: 'Éliminé.Query.ConsulterÉliminé',
        data: {
          identifiantProjet,
        },
      });

      if (Option.isNone(éliminé)) {
        throw new InvalidOperationError(
          "Vous ne pouvez pas demander le recours d'un projet non éliminé",
        );
      }

      return <DemanderRecoursPage identifiantProjet={identifiantProjet} />;
    }),
  );
}
