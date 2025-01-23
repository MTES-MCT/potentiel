import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../../raccordement.aggregate';

export type SupprimerDossierDuRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
  }
>;

export const registerSupprimerDossierDuRaccordementCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<SupprimerDossierDuRaccordementCommand> = async ({
    identifiantProjet,
    référenceDossier,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    await raccordement.supprimerDossier({
      identifiantProjet,
      référenceDossier,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement', handler);
};
