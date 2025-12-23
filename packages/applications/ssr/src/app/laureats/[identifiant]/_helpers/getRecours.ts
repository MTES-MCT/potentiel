import { cache } from 'react';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getRecours = cache(
  async (
    identifiantProjet: IdentifiantProjet.RawType,
  ): Promise<Éliminé.Recours.ConsulterRecoursReadModel | undefined> => {
    const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterRecours',
      data: { identifiantProjetValue: identifiantProjet },
    });

    return Option.isNone(recours) ? undefined : recours;
  },
);
