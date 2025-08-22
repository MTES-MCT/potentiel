import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import type { GarantiesFinancières } from '../..';

export type ModifierGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    modifiéLe: DateTime.ValueType;
  }
>;

export const registerModifierGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    garantiesFinancières,
    modifiéLe,
    modifiéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.modifier({
      attestation,
      dateConstitution,
      garantiesFinancières,
      modifiéLe,
      modifiéPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières', handler);
};
