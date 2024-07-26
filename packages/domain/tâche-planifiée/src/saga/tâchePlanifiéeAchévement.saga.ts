// import { Message, MessageHandler, mediator } from 'mediateur';

// import { Achèvement } from '@potentiel-domain/laureat';
// import { IdentifiantProjet } from '@potentiel-domain/common';

// import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
// import { AnnulerTâchePlanifiéeCommand } from '../annuler/annulerTâchePlanifiée.command';

// export type SubscriptionEvent = Achèvement.AttestationConformitéTransmiseEvent;

// export type Execute = Message<'System.Saga.TâchePlanifiéeAchèvement', SubscriptionEvent>;

// export const register = () => {
//   const handler: MessageHandler<Execute> = async (event) => {
//     const {
//       payload: { identifiantProjet },
//     } = event;
//     switch (event.type) {
//       case 'AttestationConformitéTransmise-V1':
//         await mediator.send<AnnulerTâchePlanifiéeCommand>({
//           type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
//           data: {
//             identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
//             typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresÉchoir,
//           },
//         });

//         await mediator.send<AnnulerTâchePlanifiéeCommand>({
//           type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
//           data: {
//             identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
//             typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresRappelÉchéanceUnMois,
//           },
//         });

//         await mediator.send<AnnulerTâchePlanifiéeCommand>({
//           type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
//           data: {
//             identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
//             typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresRappelÉchéanceDeuxMois,
//           },
//         });

//         break;
//     }
//   };

//   mediator.register('System.Saga.TâchePlanifiéeAchèvement', handler);
// };
