import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';

export type SupprimerDossierDuRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
  }
>;

export const registerSupprimerDossierDuRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerDossierDuRaccordementCommand> = async ({
    référenceDossier,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.supprimerDossier({ référenceDossier });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement', handler);
};
