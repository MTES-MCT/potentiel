import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../..';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
  }
>;

export const registerModifierDépôtGarantiesFinancièresEnCoursCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierDépôtGarantiesFinancièresEnCoursCommand> = async ({
    identifiantProjet,
    garantiesFinancières,
    modifiéLe,
    modifiéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.modifierDépôt({
      garantiesFinancières,
      modifiéLe,
      modifiéPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
