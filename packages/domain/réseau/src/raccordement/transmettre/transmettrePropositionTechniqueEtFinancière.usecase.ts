import { Message, MessageHandler, mediator } from 'mediateur';
import { TransmettrePropositionTechniqueEtFinancièreCommand } from './transmettrePropositionTechniqueEtFinancière.command';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

export type TransmettrePropositionTechniqueEtFinancièreUseCase = Message<
  'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
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
      TypeDocumentRaccordement.convertirEnAccuséRéceptionValueType(
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
      type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
      data: {
        content,
        documentProjet: propositionTechniqueEtFinancièreSignée,
      },
    });

    await mediator.send<TransmettrePropositionTechniqueEtFinancièreCommand>({
      type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
        formatPropositionTechniqueEtFinancièreSignée: format,
      },
    });
  };

  mediator.register('TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE', runner);
};
