import { mediator } from 'mediateur';
import { cache } from 'react';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export type GetLauréat = (
  identifiantProjet: IdentifiantProjet.RawType,
) => Promise<Lauréat.ConsulterLauréatReadModel | undefined>;

export const getLauréat: GetLauréat = cache(async (identifiantProjet) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(lauréat)) {
    return lauréat;
  }
});
