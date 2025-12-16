import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

export const getAchèvement = cache(async (identifiantProjet: IdentifiantProjet.RawType) => {
  const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
    data: { identifiantProjetValue: identifiantProjet },
  });

  if (Option.isNone(achèvement)) {
    return notFound();
  }

  return achèvement;
});
