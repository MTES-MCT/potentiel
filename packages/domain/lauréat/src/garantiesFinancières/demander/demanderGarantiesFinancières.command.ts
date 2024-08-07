import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';
import { MotifDemandeGarantiesFinancières } from '..';

export type DemanderGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateLimiteSoumission: DateTime.ValueType;
    demandéLe: DateTime.ValueType;
    motif: MotifDemandeGarantiesFinancières.ValueType;
  }
>;

export const registerDemanderGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<DemanderGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    dateLimiteSoumission,
    demandéLe,
    motif,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.demanderGarantiesFinancières({
      identifiantProjet,
      dateLimiteSoumission,
      demandéLe,
      motif,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières', handler);
};
