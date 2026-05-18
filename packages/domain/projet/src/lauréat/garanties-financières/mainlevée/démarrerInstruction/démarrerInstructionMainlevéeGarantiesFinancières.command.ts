import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type DémarrerInstructionMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.DémarrerInstructionMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    démarréLe: DateTime.ValueType;
    démarréPar: Email.ValueType;
  }
>;

export const registerDémarrerInstructionMainlevéeGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DémarrerInstructionMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    démarréLe,
    démarréPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.démarrerInstructionMainlevée({
      démarréLe,
      démarréPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.DémarrerInstructionMainlevée', handler);
};
