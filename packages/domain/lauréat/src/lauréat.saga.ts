// import { Message, MessageHandler, mediator } from 'mediateur';

// import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

// import { LauréatNotifié } from './lauréat.saga';

// export type SubscriptionEvent = LauréatNotifié;

// export type Execute = Message<'System.Lauréat.Saga.Execute', SubscriptionEvent>;

// export const register = () => {
//   const handler: MessageHandler<Execute> = async (event) => {
//     const {
//       payload: {
//         identifiantProjet,
//         attestation: { format },
//         notifiéLe,
//       },
//     } = event;
//     switch (event.type) {
//       case 'LauréatNotifié-V1':
//         // TODO générer attestation
//         const content = new ReadableStream({
//           start: async (controller) => {
//             controller.enqueue(Buffer.from('TODO'));
//             controller.close();
//           },
//         });
//         const attestation = DocumentProjet.convertirEnValueType(
//           identifiantProjet,
//           'attestation',
//           notifiéLe,
//           format,
//         );

//         await mediator.send<EnregistrerDocumentProjetCommand>({
//           type: 'Document.Command.EnregistrerDocumentProjet',
//           data: {
//             content,
//             documentProjet: attestation,
//           },
//         });

//         break;
//     }
//   };
//   mediator.register('System.Lauréat.Saga.Execute', handler);
// };

// const unsubscribeLauréatSaga = await subscribe<Lauréat.LauréatSaga.SubscriptionEvent & Event>({
//   name: 'laureat-saga',
//   streamCategory: 'lauréat',
//   eventType: ['LauréatNotifié-V1'],
//   eventHandler: async (event) => {
//     await mediator.publish<Lauréat.LauréatSaga.Execute>({
//       type: 'System.Lauréat.Saga.Execute',
//       data: event,
//     });
//   },
// });
