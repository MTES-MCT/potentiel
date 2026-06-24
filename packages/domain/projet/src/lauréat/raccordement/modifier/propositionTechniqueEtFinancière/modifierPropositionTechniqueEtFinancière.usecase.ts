import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement } from '../../index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import type { ModifierPropositionTechniqueEtFinancièreCommand } from './modifierPropositionTechniqueEtFinancière.command.js';

export type ModifierPropositionTechniqueEtFinancièreUseCase = Message<
  'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
  {
    dateSignatureValue: string;
    référenceDossierRaccordementValue: string;
    identifiantProjetValue: string;
    propositionTechniqueEtFinancièreSignéeValue: {
      content: ReadableStream;
      format: string;
    };
    estUnNouveauDocumentValue: boolean;
    rôleValue: string;
    modifiéeLeValue: string;
    modifiéeParValue: string;
  }
>;

export const registerModifierPropositionTechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ModifierPropositionTechniqueEtFinancièreUseCase> = async ({
    dateSignatureValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    propositionTechniqueEtFinancièreSignéeValue,
    estUnNouveauDocumentValue,
    rôleValue,
    modifiéeLeValue,
    modifiéeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateSignature = DateTime.convertirEnValueType(dateSignatureValue);
    const référenceDossierRaccordement = RéférenceDossierRaccordement.convertirEnValueType(
      référenceDossierRaccordementValue,
    );

    const modifiéeLe = DateTime.convertirEnValueType(modifiéeLeValue);
    const modifiéePar = Email.convertirEnValueType(modifiéeParValue);

    const propositionTechniqueEtFinancièreSignée = DocumentRaccordement.documentRaccordement(
      'proposition-technique-et-financière',
    )({
      identifiantProjet: identifiantProjetValue,
      référenceDossierRaccordement: référenceDossierRaccordementValue,
      dateSignature: dateSignatureValue,
      propositionTechniqueEtFinancièreSignée: propositionTechniqueEtFinancièreSignéeValue,
    });
    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: propositionTechniqueEtFinancièreSignéeValue.content,
        documentProjet: propositionTechniqueEtFinancièreSignée,
      },
    });

    await mediator.send<ModifierPropositionTechniqueEtFinancièreCommand>({
      type: 'Lauréat.Raccordement.Command.ModifierPropositionTechniqueEtFinancière',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
        propositionTechniqueEtFinancièreSignée: propositionTechniqueEtFinancièreSignéeValue,
        estUnNouveauDocument: estUnNouveauDocumentValue,
        rôle: Role.convertirEnValueType(rôleValue),
        modifiéeLe,
        modifiéePar,
      },
    });
  };

  mediator.register(
    'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
    runner,
  );
};
