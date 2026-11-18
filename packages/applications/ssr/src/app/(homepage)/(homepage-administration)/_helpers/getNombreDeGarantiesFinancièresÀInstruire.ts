import { mediator } from 'mediateur';
import { cache } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

export const getNombreDeGarantiesFinancièresÀInstruire = cache(async (utilisateur: string) =>
  mediator.send<Lauréat.GarantiesFinancières.ConsulterNombreDeGarantiesFinancièresÀInstruireQuery>({
    type: 'Lauréat.GarantiesFinancières.Query.ConsulterNombreDeGarantiesFinancièresÀInstruire',
    data: {
      utilisateur,
    },
  }),
);
