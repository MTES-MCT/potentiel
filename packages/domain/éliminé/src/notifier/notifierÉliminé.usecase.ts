import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { NotifierÉliminéCommand } from './notifierÉliminé.command';

export type NotifierÉliminéUseCase = Message<
  'Éliminé.UseCase.NotifierÉliminé',
  {
    identifiantProjetValue: string;
    dateNotificationValue: string;
    attestationSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerNotifierÉliminéUseCase = () => {
  const handler: MessageHandler<NotifierÉliminéUseCase> = async ({
    identifiantProjetValue,
    dateNotificationValue,
    attestationSignéeValue: { content, format },
  }) => {
    const attestationSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      'attestation',
      dateNotificationValue,
      format,
    );
    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: attestationSignée,
      },
    });

    await mediator.send<NotifierÉliminéCommand>({
      type: 'Éliminé.Command.NotifierÉliminé',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        dateNotification: DateTime.convertirEnValueType(dateNotificationValue),
        attestationSignée,
      },
    });
  };

  mediator.register('Éliminé.UseCase.NotifierÉliminé', handler);
};
