import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getMainlevéeGarantiesFinancières = cache(
  async (identifiantProjet: IdentifiantProjet.RawType) => {
    const mainlevée =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
        data: {
          identifiantProjet,
        },
      });

    return Option.isSome(mainlevée) ? mainlevée : undefined;
  },
);
