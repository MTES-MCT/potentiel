import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { DocumentProjet } from '@potentiel-domain/document';

export type ModifierRéponseSignéeMainlevéeCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.ModifierRéponseSignée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
    rejetéeLe?: DateTime.ValueType;
    nouvelleRéponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerModifierRéponseSignéeMainlevéeCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<ModifierRéponseSignéeMainlevéeCommand> = async ({
    identifiantProjet,
    modifiéeLe,
    modifiéePar,
    rejetéeLe,
    nouvelleRéponseSignée,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.modifierRéponseSignéeMainlevée({
      identifiantProjet,
      modifiéeLe,
      modifiéePar,
      rejetéeLe,
      nouvelleRéponseSignée,
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Mainlevée.Command.ModifierRéponseSignée',
    handler,
  );
};
