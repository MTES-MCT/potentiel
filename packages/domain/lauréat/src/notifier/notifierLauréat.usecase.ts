import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { NotifierLauréatCommand } from './notifierLauréat.command';

export type NotifierLauréatUseCase = Message<
  'Lauréat.UseCase.NotifierLauréat',
  {
    identifiantProjetValue: string;
    dateNotificationValue: string;
    attestationSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerNotifierLauréatUseCase = () => {
  const handler: MessageHandler<NotifierLauréatUseCase> = async ({
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

    await mediator.send<NotifierLauréatCommand>({
      type: 'Lauréat.Command.NotifierLauréat',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        dateNotification: DateTime.convertirEnValueType(dateNotificationValue),
        attestationSignée,
      },
    });
  };

  mediator.register('Lauréat.UseCase.NotifierLauréat', handler);
};
