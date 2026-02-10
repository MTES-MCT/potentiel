import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import { GarantiesFinancières } from '../../index.js';

export type ModifierGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    modifiéPar: Email.ValueType;
    modifiéLe: DateTime.ValueType;
  }
>;

export const registerModifierGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    garantiesFinancières,
    modifiéLe,
    modifiéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.modifier({
      garantiesFinancières,
      modifiéLe,
      modifiéPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières', handler);
};
