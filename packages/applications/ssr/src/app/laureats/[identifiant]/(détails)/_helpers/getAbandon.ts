import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getAbandon = cache(async (identifiantProjet: IdentifiantProjet.RawType) => {
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: { identifiantProjetValue: identifiantProjet },
  });

  return Option.isNone(abandon) ? undefined : abandon;
});
