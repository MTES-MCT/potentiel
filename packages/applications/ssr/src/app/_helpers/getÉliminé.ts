import { mediator } from 'mediateur';
import { cache } from 'react';

import { Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export type GetÉliminé = (
  identifiantProjet: string,
) => Promise<Éliminé.ConsulterÉliminéReadModel | undefined>;

export const getÉliminé: GetÉliminé = cache(async (identifiantProjet: string) => {
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
