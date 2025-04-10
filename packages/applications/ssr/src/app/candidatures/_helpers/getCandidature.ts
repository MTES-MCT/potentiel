import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getCandidature = cache(async (identifiantProjet: string) => {
  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    notFound();
  }

  return candidature;
});
