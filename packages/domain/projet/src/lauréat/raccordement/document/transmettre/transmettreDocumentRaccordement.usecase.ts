import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement, TypeDocumentsRaccordement } from '../../index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import type { TransmettreDocumentCommand } from './transmettreDocumentRaccordement.command.js';

export type TransmettreDocumentUseCase = Message<
  'Lauréat.Raccordement.UseCase.TransmettreDocument',
  {
    dateSignatureValue: string;
    référenceDossierRaccordementValue: string;
    identifiantProjetValue: string;
    typeValue: string;
    documentRaccordementValue: {
      content: ReadableStream;
      format: string;
    };
    transmisLeValue: string;
    transmisParValue: string;
  }
>;

export const registerTransmettreDocumentUseCase = () => {
  const runner: MessageHandler<TransmettreDocumentUseCase> = async ({
    dateSignatureValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    documentRaccordementValue: { format, content },
    typeValue,
    transmisLeValue,
    transmisParValue,
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

    await mediator.send<TransmettreDocumentCommand>({
      type: 'Lauréat.Raccordement.Command.TransmettreDocument',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
        formatDocumentRaccordement: format,
        transmisLe: DateTime.convertirEnValueType(transmisLeValue),
        transmisPar: Email.convertirEnValueType(transmisParValue),
        type: typeDocument,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.TransmettreDocument', runner);
};
