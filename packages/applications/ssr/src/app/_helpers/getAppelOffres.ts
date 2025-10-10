import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const getAppelOffres = cache(async (identifiantAppelOffre: string) => {
  const logger = getLogger('getAppelOffre');

  const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre,
    },
  });

  if (Option.isNone(appelOffres)) {
    logger.warn(`Appel d'offres non trouvé`, { identifiantAppelOffre });

    return notFound();
  }

  return appelOffres;
});
