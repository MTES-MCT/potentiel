import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';
import { Option } from '@potentiel-libraries/monads';
import { cache } from 'react';

export const getAbandon = cache(async (identifiantProjet: IdentifiantProjet.RawType) => {
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: { identifiantProjetValue: identifiantProjet },
  });

  return Option.isNone(abandon) ? undefined : abandon;
});
