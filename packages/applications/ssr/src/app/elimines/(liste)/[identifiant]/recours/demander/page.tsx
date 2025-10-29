import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { Éliminé } from '@potentiel-domain/projet';
import { InvalidOperationError } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { DemanderRecoursPage } from './DemanderRecours.page';

export const metadata: Metadata = {
  title: 'Demander un recours pour le projet - Potentiel',
  description: 'Formulaire de recours',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
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
  });
}
