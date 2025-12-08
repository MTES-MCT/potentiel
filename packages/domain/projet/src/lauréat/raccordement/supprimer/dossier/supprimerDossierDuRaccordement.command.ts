import { Message, MessageHandler, mediator } from 'mediateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

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

    await projet.lauréat.raccordement.supprimerDossierRaccordement({ référenceDossier });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement', handler);
};
