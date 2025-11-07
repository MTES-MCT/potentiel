import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../../document-projet';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../../typeDocumentRaccordement.valueType';

import { TransmettrePropositionTechniqueEtFinancièreCommand } from './transmettrePropositionTechniqueEtFinancière.command';

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
  }
>;

export const registerTransmettrePropositionTechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<TransmettrePropositionTechniqueEtFinancièreUseCase> = async ({
    dateSignatureValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    propositionTechniqueEtFinancièreSignéeValue: { format, content },
  }) => {
    const propositionTechniqueEtFinancièreSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRaccordement.convertirEnPropositionTechniqueEtFinancièreValueType(
        référenceDossierRaccordementValue,
      ).formatter(),
      dateSignatureValue,
      format,
    );

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
      },
    });
  };

  mediator.register(
    'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
    runner,
  );
};
