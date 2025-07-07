import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    formatAccuséRéception: string;
    rôle: Role.ValueType;
  }
>;

export const registerModifierDemandeComplèteRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    dateQualification,
    référenceDossierRaccordement,
    formatAccuséRéception,
    identifiantProjet,
    rôle,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierDemandeComplèteRaccordement({
      dateQualification,
      référenceDossierRaccordement,
      formatAccuséRéception,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement', handler);
};
