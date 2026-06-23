import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { TypeDocumentConventionRaccordement } from '../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type TransmettreDocumentRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.TransmettreDocumentRaccordement',
  {
    type: TypeDocumentConventionRaccordement.ValueType;
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    formatDocumentRaccordement: string;
    transmiseLe: DateTime.ValueType;
    transmisePar: Email.ValueType;
  }
>;

export const registerTransmettreDocumentRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreDocumentRaccordementCommand> = async ({
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatDocumentRaccordement,
    transmiseLe,
    transmisePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.transmettreDocumentRaccordement({
      dateSignature,
      référenceDossierRaccordement,
      formatDocumentRaccordement,
      transmiseLe,
      transmisePar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDocumentRaccordement', handler);
};
