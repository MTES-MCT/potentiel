import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot } from '../../../..';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';

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
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettrePropositionTechniqueEtFinancièreCommand> = async ({
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatPropositionTechniqueEtFinancièreSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.transmettrePropositionTechniqueEtFinancière({
      dateSignature,
      référenceDossierRaccordement,
      formatPropositionTechniqueEtFinancièreSignée,
    });
  };

  mediator.register(
    'Lauréat.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
    handler,
  );
};
