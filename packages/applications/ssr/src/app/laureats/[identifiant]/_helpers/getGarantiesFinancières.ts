import { mediator } from 'mediateur';
import { cache } from 'react';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getGarantiesFinancières = cache(
  async (identifiantProjet: IdentifiantProjet.RawType) => {
    const garantiesFinancièresActuelles =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresActuellesQuery>(
        {
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresActuelles',
          data: { identifiantProjetValue: identifiantProjet },
        },
      );

    const dépôt =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });

    const enAttente =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresEnAttenteQuery>(
        {
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
          data: { identifiantProjetValue: identifiantProjet },
        },
      );

    return {
      actuelles: Option.isSome(garantiesFinancièresActuelles)
        ? garantiesFinancièresActuelles
        : undefined,
      dépôt: Option.isSome(dépôt) ? dépôt : undefined,
      enAttente: Option.isSome(enAttente) ? enAttente : undefined,
    };
  },
);
