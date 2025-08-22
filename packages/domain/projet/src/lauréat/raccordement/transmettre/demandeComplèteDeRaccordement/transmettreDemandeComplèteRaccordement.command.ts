import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, type Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';

export type TransmettreDemandeComplèteRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateQualification: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    formatAccuséRéception?: string;
    transmisePar: Email.ValueType;
  }
>;

export const registerTransmettreDemandeComplèteRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreDemandeComplèteRaccordementCommand> = async ({
    identifiantProjet,
    dateQualification,
    référenceDossier,
    formatAccuséRéception,
    transmisePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.transmettreDemandeComplèteDeRaccordement({
      dateQualification,
      référenceDossier,
      formatAccuséRéception,
      transmisePar,
      transmiseLe: DateTime.now(),
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDemandeComplèteRaccordement', handler);
};
