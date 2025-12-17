import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getRaccordement = cache(async (identifiantProjet: IdentifiantProjet.RawType) => {
  const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet },
  });

  return Option.isNone(raccordement) ? undefined : raccordement;
});
