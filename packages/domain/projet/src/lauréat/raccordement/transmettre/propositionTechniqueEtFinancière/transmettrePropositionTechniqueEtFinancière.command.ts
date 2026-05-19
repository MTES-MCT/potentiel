import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type TransmettrePropositionTechniqueEtFinancièreCommand = Message<
  'Lauréat.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
  {
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    formatPropositionTechniqueEtFinancièreSignée: string;
    transmiseLe: DateTime.ValueType;
    transmisePar: Email.ValueType;
  }
>;

export const registerTransmettrePropositionTechniqueEtFinancièreCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettrePropositionTechniqueEtFinancièreCommand> = async ({
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatPropositionTechniqueEtFinancièreSignée,
    transmiseLe,
    transmisePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.transmettrePropositionTechniqueEtFinancière({
      dateSignature,
      référenceDossierRaccordement,
      formatPropositionTechniqueEtFinancièreSignée,
      transmiseLe,
      transmisePar,
    });
  };

  mediator.register(
    'Lauréat.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
    handler,
  );
};
