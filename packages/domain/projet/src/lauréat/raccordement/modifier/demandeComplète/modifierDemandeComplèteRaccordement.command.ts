import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
    rôle: Role.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
    formatAccuséRéception?: string;
  }
>;

export const registerModifierDemandeComplèteRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    dateQualification,
    référenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    formatAccuséRéception,
    identifiantProjet,
    rôle,
    modifiéeLe,
    modifiéePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierDemandeComplèteRaccordement({
      dateQualification,
      référenceDossierRaccordement,
      référenceDossierRaccordementActuelle,
      formatAccuséRéception,
      rôle,
      modifiéeLe,
      modifiéePar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement', handler);
};
