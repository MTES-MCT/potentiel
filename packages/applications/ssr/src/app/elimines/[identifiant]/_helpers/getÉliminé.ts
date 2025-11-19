import { cache } from 'react';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Éliminé } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getProjetÉliminé = cache(async (identifiantProjet: string) => {
  const logger = getLogger('getProjetÉliminé');

  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(éliminé)) {
    logger.warn(`Projet éliminé non trouvé`, { identifiantProjet });

    return notFound();
  }

  return éliminé;
});
