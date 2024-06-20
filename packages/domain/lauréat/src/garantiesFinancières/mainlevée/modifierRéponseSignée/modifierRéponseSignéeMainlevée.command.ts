import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { DocumentProjet } from '@potentiel-domain/document';

export type ModifierRéponseSignéeMainlevéeAccordéeCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.ModifierRéponseSignéeAccord',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
    rejetéeLe?: DateTime.ValueType;
    nouvelleRéponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerModifierRéponseSignéeMainlevéeAccordéeCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<ModifierRéponseSignéeMainlevéeAccordéeCommand> = async ({
    identifiantProjet,
    modifiéeLe,
    modifiéePar,
    rejetéeLe,
    nouvelleRéponseSignée,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.modifierRéponseSignéeMainlevéeAccordée({
      identifiantProjet,
      modifiéeLe,
      modifiéePar,
      rejetéeLe,
      nouvelleRéponseSignée,
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Command.ModifierRéponseSignéeAccord',
    handler,
  );
};
