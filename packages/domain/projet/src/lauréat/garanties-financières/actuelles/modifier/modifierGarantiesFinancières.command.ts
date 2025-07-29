import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { TypeGarantiesFinancières } from '../../../../candidature';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
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
    type,
    dateÉchéance,
    modifiéLe,
    modifiéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.modifier({
      attestation,
      dateConstitution,
      type,
      dateÉchéance,
      modifiéLe,
      modifiéPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières', handler);
};
