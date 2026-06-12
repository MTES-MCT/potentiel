import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { assertIdentifiantProjet } from './assertIdentifiantProjet';

export const getCahierDesCharges = cache(async (identifiantProjet: string) => {
  assertIdentifiantProjet(identifiantProjet);
  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    return notFound();
  }

  return cahierDesCharges;
});
