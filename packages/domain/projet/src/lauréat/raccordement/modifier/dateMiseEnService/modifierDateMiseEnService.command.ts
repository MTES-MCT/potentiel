import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type ModifierDateMiseEnServiceCommand = Message<
  'Lauréat.Raccordement.Command.ModifierDateMiseEnService',
  {
    dateMiseEnService: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
  }
>;

export const registerModifierDateMiseEnServiceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossier,
    identifiantProjet,
    modifiéeLe,
    modifiéePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierDateMiseEnService({
      dateDésignation: projet.candidature.notifiéeLe,
      dateMiseEnService,
      référenceDossier,
      modifiéeLe,
      modifiéePar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierDateMiseEnService', handler);
};
