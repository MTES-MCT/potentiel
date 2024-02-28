import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import * as TypeDocumentRaccordement from '../typeDocumentRaccordement.valueType';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { ModifierPropositionTechniqueEtFinancièreCommand } from './modifierPropositiontechniqueEtFinancière.command';

export type ModifierPropositiontechniqueEtFinancièreUseCase = Message<
  'Réseau.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
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

export const registerModifierPropositiontechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ModifierPropositiontechniqueEtFinancièreUseCase> = async ({
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

    await mediator.send<ModifierPropositionTechniqueEtFinancièreCommand>({
      type: 'Réseau.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
        formatPropositionTechniqueEtFinancièreSignée: format,
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière', runner);
};
