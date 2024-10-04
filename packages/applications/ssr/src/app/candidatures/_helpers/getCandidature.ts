import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getCandidature = cache(async (identifiantProjet: string) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });
  if (Option.isNone(candidature)) {
    getLogger().warn('Candidature non trouvée', { identifiantProjet });
    notFound();
  }
  return candidature;
});
