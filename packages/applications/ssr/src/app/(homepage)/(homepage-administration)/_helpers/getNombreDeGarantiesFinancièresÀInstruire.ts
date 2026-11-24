import { mediator } from 'mediateur';
import { cache } from 'react';

import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

export const getNombreDeGarantiesFinancièresÀInstruire = cache(async (utilisateur: string) =>
  mediator.send<Lauréat.GarantiesFinancières.ConsulterNombreDeGarantiesFinancièresÀInstruireQuery>({
    type: 'Lauréat.GarantiesFinancières.Query.ConsulterNombreDeGarantiesFinancièresÀInstruire',
    data: {
      utilisateur,
      date: DateTime.now().retirerNombreDeMois(1).formatter(),
    },
  }),
);
