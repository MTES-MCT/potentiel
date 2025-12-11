import { RangeOptions } from '@potentiel-domain/entity';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';
import { cache } from 'react';

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  email: string;
  range?: RangeOptions;
};
export const getTâches = cache(async ({ identifiantProjet, email, range }: Props) => {
  const tâches = await mediator.send<Lauréat.Tâche.ListerTâchesQuery>({
    type: 'Tâche.Query.ListerTâches',
    data: {
      range,
      identifiantProjet: identifiantProjet.formatter(),
      email,
    },
  });

  return tâches;
});
