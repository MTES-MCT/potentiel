import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type ÉchoirGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateÉchéance: DateTime.ValueType;
    échuPar: Email.ValueType;
    échuLe: DateTime.ValueType;
  }
>;

export const registerÉchoirGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<ÉchoirGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    dateÉchéance,
    échuéLe,
    échuéPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.échoir({
      identifiantProjet,
      dateÉchéance,
      échuéLe,
      échuéPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières', handler);
};
