import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentRaccordement, TypeDocumentConventionRaccordement } from '../../index.js';
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
    const typeDocument = TypeDocumentConventionRaccordement.convertirEnValueType(type);

    const documentRaccordement = DocumentRaccordement.documentRaccordement({
      identifiantProjet: identifiantProjetValue,
      référenceDossierRaccordement: référenceDossierRaccordementValue,
      dateSignature: dateSignatureValue,
      documentRaccordement: { format },
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
      },
    });
  };

  mediator.register('Lauréat.Raccordement.UseCase.TransmettreDocumentRaccordement', runner);
};
