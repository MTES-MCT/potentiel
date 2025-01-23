import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type TransmettrePropositionTechniqueEtFinancièreCommand = Message<
  'Lauréat.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
  {
    dateSignature: DateTime.ValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    formatPropositionTechniqueEtFinancièreSignée: string;
  }
>;

export const registerTransmettrePropositionTechniqueEtFinancièreCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);
  const handler: MessageHandler<TransmettrePropositionTechniqueEtFinancièreCommand> = async ({
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatPropositionTechniqueEtFinancièreSignée,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);
    await raccordement.transmettrePropositionTechniqueEtFinancière({
      dateSignature,
      référenceDossierRaccordement,
      identifiantProjet,
      formatPropositionTechniqueEtFinancièreSignée,
    });
  };

  mediator.register(
    'Lauréat.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
    handler,
  );
};
