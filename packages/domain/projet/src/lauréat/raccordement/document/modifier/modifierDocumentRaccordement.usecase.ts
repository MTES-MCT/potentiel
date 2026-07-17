import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement, TypeDocumentsRaccordement } from '../../index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import type { ModifierDocumentCommand } from './modifierDocumentRaccordement.command.js';

export type ModifierDocumentUseCase = Message<
  'Lauréat.Raccordement.UseCase.ModifierDocument',
  {
    dateSignatureValue: string;
    référenceDossierRaccordementValue: string;
    identifiantProjetValue: string;
    typeValue: string;
    documentRaccordementValue: {
      content: ReadableStream;
      format: string;
    };
    modifiéLeValue: string;
    modifiéParValue: string;
    rôleValue: string;
    estUnNouveauDocumentValue: boolean;
  }
>;

export const registerModifierDocumentUseCase = () => {
  const runner: MessageHandler<ModifierDocumentUseCase> = async ({
    dateSignatureValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    documentRaccordementValue: { format, content },
    estUnNouveauDocumentValue,
    typeValue,
    modifiéLeValue,
    modifiéParValue,
    rôleValue,
  }) => {
    const typeDocument = TypeDocumentsRaccordement.convertirEnValueType(typeValue);

    const documentRaccordement = DocumentRaccordement.documentRaccordement(typeDocument.type)({
      identifiantProjet: identifiantProjetValue,
      référenceDossierRaccordement: référenceDossierRaccordementValue,
      dateSignature: dateSignatureValue,
      document: { format },
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
        documentProjet: documentRaccordement,
      },
    });

    await mediator.send<ModifierDocumentCommand>({
      type: 'Lauréat.Raccordement.Command.ModifierDocument',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
        formatDocumentRaccordement: format,
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        type: typeDocument,
        estUnNouveauDocument: estUnNouveauDocumentValue,
        rôle: Role.convertirEnValueType(rôleValue),
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.ModifierDocument', runner);
};
