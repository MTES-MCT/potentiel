import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { assertIdentifiantProjet } from '@/app/_helpers/assertIdentifiantProjet';

export const getAchèvement = cache(async (identifiantProjet: string) => {
  assertIdentifiantProjet(identifiantProjet);
  const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
    type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
    data: { identifiantProjetValue: identifiantProjet },
  });

  if (Option.isNone(achèvement)) {
    return notFound();
  }

  return achèvement;
});
