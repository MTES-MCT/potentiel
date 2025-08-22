import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ÉchoirGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerÉchoirGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ÉchoirGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.garantiesFinancières.échoir();
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières', handler);
};
