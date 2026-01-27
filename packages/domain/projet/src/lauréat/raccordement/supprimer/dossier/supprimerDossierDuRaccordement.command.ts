import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type SupprimerDossierDuRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    suppriméLe: DateTime.ValueType;
    suppriméPar: Email.ValueType;
  }
>;

export const registerSupprimerDossierDuRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerDossierDuRaccordementCommand> = async ({
    référenceDossier,
    identifiantProjet,
    suppriméLe,
    suppriméPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.supprimerDossier({
      référenceDossier,
      suppriméLe,
      suppriméPar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement', handler);
};
