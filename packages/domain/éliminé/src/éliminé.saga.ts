// import { Message, MessageHandler, mediator } from 'mediateur';

// import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

// import { ÉliminéNotifié } from './éliminé';

// export type SubscriptionEvent = ÉliminéNotifié;

// export type Execute = Message<'System.Éliminé.Saga.Execute', SubscriptionEvent>;

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
//       case 'ÉliminéNotifié-V1':
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
//   mediator.register('System.Éliminé.Saga.Execute', handler);
// };

// const unsubscribeÉliminéSaga = await subscribe<Éliminé.ÉliminéSaga.SubscriptionEvent & Event>({
//   name: 'elimine-saga',
//   streamCategory: 'éliminé',
//   eventType: ['ÉliminéNotifié-V1'],
//   eventHandler: async (event) => {
//     await mediator.publish<Éliminé.ÉliminéSaga.Execute>({
//       type: 'System.Éliminé.Saga.Execute',
//       data: event,
//     });
//   },
// });
