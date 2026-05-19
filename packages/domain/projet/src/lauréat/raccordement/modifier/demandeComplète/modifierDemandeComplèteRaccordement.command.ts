import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type ModifierDemandeComplèteRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    rôle: Role.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
    accuséRéception: { format: string };
    estUnNouveauDocument: boolean;
  }
>;

export const registerModifierDemandeComplèteRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierDemandeComplèteRaccordementCommand> = async ({
    dateQualification,
    référenceDossierRaccordement,
    accuséRéception,
    identifiantProjet,
    rôle,
    modifiéeLe,
    modifiéePar,
    estUnNouveauDocument,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierDemandeComplèteRaccordement({
      dateQualification,
      référenceDossierRaccordement,
      accuséRéception,
      rôle,
      modifiéeLe,
      modifiéePar,
      estUnNouveauDocument,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierDemandeComplèteRaccordement', handler);
};
