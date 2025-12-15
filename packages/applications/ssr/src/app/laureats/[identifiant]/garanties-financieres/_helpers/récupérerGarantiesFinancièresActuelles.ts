import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

export const récuperérerGarantiesFinancièresActuelles = cache(
  async (identifiantProjet: IdentifiantProjet.RawType) => {
    return mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
      data: { identifiantProjetValue: identifiantProjet },
    });
  },
);
