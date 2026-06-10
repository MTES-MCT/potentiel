import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getLauréatInfos = cache(async (identifiantProjet: string) => {
  const logger = getLogger('getLauréatInfos');

  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(lauréat)) {
    logger.warn('Projet lauréat non trouvé', { identifiantProjet });
    return notFound();
  }

  return lauréat;
});
