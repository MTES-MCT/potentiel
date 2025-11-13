import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

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
