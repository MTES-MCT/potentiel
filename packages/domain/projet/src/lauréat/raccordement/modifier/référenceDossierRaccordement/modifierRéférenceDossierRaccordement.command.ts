import { Message, MessageHandler, mediator } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierRéférenceDossierRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    rôle: Role.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
  }
>;

export const registerModifierRéférenceDossierRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierRéférenceDossierRaccordementCommand> = async ({
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    modifiéeLe,
    modifiéePar,
    rôle,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierRéférenceDossierRacordement({
      nouvelleRéférenceDossierRaccordement,
      référenceDossierRaccordementActuelle,
      modifiéeLe,
      modifiéePar,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement', handler);
};
