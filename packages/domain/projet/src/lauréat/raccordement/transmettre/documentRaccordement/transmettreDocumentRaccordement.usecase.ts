import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement, TypeDocumentsRaccordement } from '../../index.js';
import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import type { TransmettreDocumentRaccordementCommand } from './transmettreDocumentRaccordement.command.js';

export type TransmettreDocumentRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.TransmettreDocumentRaccordement',
  {
    dateSignatureValue: string;
    référenceDossierRaccordementValue: string;
    identifiantProjetValue: string;
    type: string;
    documentRaccordementValue: {
      content: ReadableStream;
      format: string;
    };
    transmiseLeValue: string;
    transmiseParValue: string;
  }
>;

export const registerTransmettreDocumentRaccordementUseCase = () => {
  const runner: MessageHandler<TransmettreDocumentRaccordementUseCase> = async ({
    dateSignatureValue,
    identifiantProjetValue,
    référenceDossierRaccordementValue,
    documentRaccordementValue: { format, content },
    type,
    transmiseLeValue,
    transmiseParValue,
  }) => {
    const typeDocument = TypeDocumentsRaccordement.convertirEnValueType(type);

    const documentRaccordement = DocumentRaccordement.documentRaccordement(typeDocument.type)({
      identifiantProjet: identifiantProjetValue,
      référenceDossierRaccordement: référenceDossierRaccordementValue,
      dateSignature: dateSignatureValue,
      documentRaccordement: format,
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

    await mediator.send<TransmettreDocumentRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.TransmettreDocumentRaccordement',
      data: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
        formatDocumentRaccordement: format,
        transmiseLe: DateTime.convertirEnValueType(transmiseLeValue),
        transmisePar: Email.convertirEnValueType(transmiseParValue),
        type: typeDocument,
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.TransmettreDocumentRaccordement', runner);
};
