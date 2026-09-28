import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { TypeDocumentsRaccordement } from '../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type ModifierTypeDocumentCommand = Message<
  'Lauréat.Raccordement.Command.ModifierTypeDocument',
  {
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    ancienType: TypeDocumentsRaccordement.ValueType;
    nouveauType: TypeDocumentsRaccordement.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerModifierTypeDocumentCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierTypeDocumentCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    modifiéLe,
    modifiéPar,
    ancienType,
    nouveauType,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierTypeDocumentRaccordement({
      ancienType,
      nouveauType,
      référenceDossierRaccordement,
      modifiéLe,
      modifiéPar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierTypeDocument', handler);
};
