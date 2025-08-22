import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { InvalidOperationError } from '@potentiel-domain/core';
import type { Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { DemanderRecoursPage } from '@/app/elimine/[identifiant]/recours/demander/DemanderRecours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

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
