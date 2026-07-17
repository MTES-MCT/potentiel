import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type { TypeDocumentsRaccordement } from '../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type TransmettreDocumentCommand = Message<
  'Lauréat.Raccordement.Command.TransmettreDocument',
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

export const registerTransmettreDocumentCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreDocumentCommand> = async ({
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

  mediator.register('Lauréat.Raccordement.Command.TransmettreDocument', handler);
};
