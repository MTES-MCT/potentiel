import { mediator } from 'mediateur';
import { cache } from 'react';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

export const récuperérerGarantiesFinancièresActuelles = cache(
  async (identifiantProjet: IdentifiantProjet.RawType) => {
    return mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresActuellesQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresActuelles',
      data: { identifiantProjetValue: identifiantProjet },
    });
  },
);
