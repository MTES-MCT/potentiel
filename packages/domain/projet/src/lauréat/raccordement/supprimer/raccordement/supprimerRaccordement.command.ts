import { Message, MessageHandler, mediator } from 'mediateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type SupprimerRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerSupprimerRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerRaccordementCommand> = async (options) => {
    const projet = await getProjetAggregateRoot(options.identifiantProjet);
    await projet.lauréat.raccordement.supprimerRaccordement();
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerRaccordement', handler);
};
