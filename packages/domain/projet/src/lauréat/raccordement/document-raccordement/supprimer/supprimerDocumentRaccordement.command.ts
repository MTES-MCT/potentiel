import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { TypeDocumentsRaccordement } from '../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type SupprimerDocumentRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDocumentRaccordement',
  {
    type: TypeDocumentsRaccordement.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméLe: DateTime.ValueType;
    suppriméPar: Email.ValueType;
  }
>;

export const registerSupprimerDocumentRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerDocumentRaccordementCommand> = async ({
    type,
    référenceDossierRaccordement,
    identifiantProjet,
    suppriméLe,
    suppriméPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.supprimerDocumentRaccordement({
      type,
      référenceDossierRaccordement,
      suppriméLe,
      suppriméPar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDocumentRaccordement', handler);
};
