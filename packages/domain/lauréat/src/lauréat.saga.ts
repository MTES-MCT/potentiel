import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { LauréatNotifié } from './lauréat';

export type SubscriptionEvent = LauréatNotifié;

export type Execute = Message<'System.Lauréat.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: {
        identifiantProjet,
        attestation: { format },
        notifiéLe,
      },
    } = event;
    switch (event.type) {
      case 'LauréatNotifié-V1':
        // TODO générer attestation
        const content = new ReadableStream({
          start: async (controller) => {
            controller.enqueue(Buffer.from('TODO'));
            controller.close();
          },
        });
        const attestation = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          'attestation',
          notifiéLe,
          format,
        );

        await mediator.send<EnregistrerDocumentProjetCommand>({
          type: 'Document.Command.EnregistrerDocumentProjet',
          data: {
            content,
            documentProjet: attestation,
          },
        });

        break;
    }
  };
  mediator.register('System.Lauréat.Saga.Execute', handler);
};
