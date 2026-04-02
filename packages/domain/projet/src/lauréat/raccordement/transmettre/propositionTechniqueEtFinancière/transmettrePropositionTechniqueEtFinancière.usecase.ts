import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement } from '../../index.js';

import { TransmettrePropositionTechniqueEtFinancièreCommand } from './transmettrePropositionTechniqueEtFinancière.command.js';

export type TransmettrePropositionTechniqueEtFinancièreUseCase = Message<
  'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
  {
    dateSignatureValue: string;
    référenceDossierRaccordementValue: string;
    identifiantProjetValue: string;
    propositionTechniqueEtFinancièreSignéeValue: {
      content: ReadableStream;
      format: string;
    };
    transmiseLeValue: string;
    transmiseParValue: string;
  }
>;

export const registerTransmettrePropositionTechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<TransmettrePropositionTechniqueEtFinancièreUseCase> = async ({
    dateSignatureValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    propositionTechniqueEtFinancièreSignéeValue: { format, content },
    transmiseLeValue,
    transmiseParValue,
  }) => {
    const propositionTechniqueEtFinancièreSignée =
      DocumentRaccordement.propositionTechniqueEtFinancière({
        identifiantProjet: identifiantProjetValue,
        référenceDossierRaccordement: référenceDossierRaccordementValue,
        dateSignature: dateSignatureValue,
        propositionTechniqueEtFinancièreSignée: { format },
      });

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateSignature = DateTime.convertirEnValueType(dateSignatureValue);
    const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementValue,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: propositionTechniqueEtFinancièreSignée,
      },
    });

    await mediator.send<TransmettrePropositionTechniqueEtFinancièreCommand>({
      type: 'Lauréat.Raccordement.Command.TransmettrePropositionTechniqueEtFinancière',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
        formatPropositionTechniqueEtFinancièreSignée: format,
        transmiseLe: DateTime.convertirEnValueType(transmiseLeValue),
        transmisePar: Email.convertirEnValueType(transmiseParValue),
      },
    });
  };

  mediator.register(
    'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
    runner,
  );
};
