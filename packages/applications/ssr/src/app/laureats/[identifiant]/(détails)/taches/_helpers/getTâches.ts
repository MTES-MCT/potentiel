import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

export const getTâches = cache(
  async (identifiantProjet: IdentifiantProjet.RawType, email: string) => {
    const tâches = await mediator.send<Lauréat.Tâche.ListerTâchesQuery>({
      type: 'Tâche.Query.ListerTâches',
      data: {
        identifiantProjet,
        email,
      },
    });

    return tâches;
  },
);
