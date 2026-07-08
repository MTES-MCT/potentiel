import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { TypeDocumentsRaccordement } from '../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type ModifierDocumentCommand = Message<
  'Lauréat.Raccordement.Command.ModifierDocument',
  {
    type: TypeDocumentsRaccordement.ValueType;
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    formatDocumentRaccordement: string;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    rôle: Role.ValueType;
    estUnNouveauDocument: boolean;
  }
>;

export const registerModifierDocumentCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<ModifierDocumentCommand> = async ({
    type,
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatDocumentRaccordement,
    modifiéLe,
    modifiéPar,
    rôle,
    estUnNouveauDocument,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierDocumentRaccordement({
      type,
      dateSignature,
      référenceDossierRaccordement,
      formatDocumentRaccordement,
      modifiéLe,
      modifiéPar,
      rôle,
      estUnNouveauDocument,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierDocument', handler);
};
