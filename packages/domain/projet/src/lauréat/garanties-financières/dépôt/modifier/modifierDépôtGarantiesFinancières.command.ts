import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { GarantiesFinancières } from '../../index.js';

export type ModifierDépôtGarantiesFinancièresEnCoursCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    estUnNouveauDocument: boolean;
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
    estUnNouveauDocument,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.modifierDépôt({
      garantiesFinancières,
      modifiéLe,
      modifiéPar,
      estUnNouveauDocument,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
    handler,
  );
};
