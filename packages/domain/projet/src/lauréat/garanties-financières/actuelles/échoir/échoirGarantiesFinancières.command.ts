import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ÉchoirGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    échuLe: DateTime.ValueType;
  }
>;

export const registerÉchoirGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ÉchoirGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    échuLe,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.garantiesFinancières.échoir({ échuLe });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières', handler);
};
