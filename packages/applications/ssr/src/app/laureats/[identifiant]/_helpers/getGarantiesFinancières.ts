import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getGarantiesFinancières = cache(
  async (identifiantProjet: IdentifiantProjet.RawType) => {
    const garantiesFinancièresActuelles =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });

    const dépôt =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });

    return {
      actuelles: Option.isNone(garantiesFinancièresActuelles)
        ? undefined
        : garantiesFinancièresActuelles,
      dépôt: Option.isNone(dépôt) ? undefined : dépôt,
    };
  },
);
