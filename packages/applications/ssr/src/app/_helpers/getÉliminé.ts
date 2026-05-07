import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export type GetÉliminé = (
  identifiantProjet: IdentifiantProjet.RawType,
) => Promise<Éliminé.ConsulterÉliminéReadModel | undefined>;

export const getÉliminé: GetÉliminé = cache(async (identifiantProjet) => {
  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(éliminé)) {
    return éliminé;
  }
});
