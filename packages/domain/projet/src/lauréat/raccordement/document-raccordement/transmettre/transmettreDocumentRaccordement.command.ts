import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { TypeDocumentsRaccordement } from '../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type TransmettreDocumentRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.TransmettreDocumentRaccordement',
  {
    type: TypeDocumentsRaccordement.ValueType;
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    formatDocumentRaccordement: string;
    transmisLe: DateTime.ValueType;
    transmisPar: Email.ValueType;
  }
>;

export const registerTransmettreDocumentRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreDocumentRaccordementCommand> = async ({
    type,
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatDocumentRaccordement,
    transmisLe,
    transmisPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.transmettreDocumentRaccordement({
      type,
      dateSignature,
      référenceDossierRaccordement,
      formatDocumentRaccordement,
      transmisLe,
      transmisPar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDocumentRaccordement', handler);
};
