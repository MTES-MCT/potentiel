import { cache } from 'react';
import { notFound } from 'next/navigation';

import { getLogger } from '@potentiel-libraries/monitoring';

import { getAppelOffres } from './getAppelOffres';

type GetPériodeProps = {
  identifiantAppelOffres: string;
  identifiantPériode: string;
};

export const getPériode = cache(
  async ({ identifiantAppelOffres, identifiantPériode }: GetPériodeProps) => {
    const logger = getLogger('getAppelOffre');

    const appelOffres = await getAppelOffres(identifiantAppelOffres);

    const période = appelOffres.periodes.find((p) => p.id === identifiantPériode);

    if (!période) {
      logger.warn(`Période non trouvée`, { identifiantPériode, identifiantAppelOffres });

      return notFound();
    }

    return période;
  },
);
