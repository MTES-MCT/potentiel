import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { TypeDocumentsRaccordement } from '../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type SupprimerDocumentCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDocument',
  {
    type: TypeDocumentsRaccordement.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméLe: DateTime.ValueType;
    suppriméPar: Email.ValueType;
    rôle: Role.ValueType;
  }
>;

export const registerSupprimerDocumentCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerDocumentCommand> = async ({
    type,
    référenceDossierRaccordement,
    identifiantProjet,
    suppriméLe,
    suppriméPar,
    rôle,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.supprimerDocumentRaccordement({
      type,
      référenceDossierRaccordement,
      suppriméLe,
      suppriméPar,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDocument', handler);
};
