import { Message, MessageHandler, mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../infrastructure/removeProjection';

export type SubscriptionEvent =
  | (GarantiesFinancières.GarantiesFinancièresEvent & Event)
  | RebuildTriggered;

export type Execute = Message<
  'System.Projector.Lauréat.GarantiesFinancières.Mainlevée',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;
    if (type === 'RebuildTriggered') {
      await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
        `mainlevee-garanties-financieres|${payload.id}`,
      );
    } else {
      // const { identifiantProjet } = payload;

      switch (type) {
        case 'MainlevéeGarantiesFinancièresDemandée-V1':
          // const entityKey = `${identifiantProjet}#${payload.demandéLe}`;
          // const détailProjet = await getProjectData(identifiantProjet);

          // const data: GarantiesFinancières.MainlevéeGarantiesFinancièresEntity = {
          // };

          // await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
          //   `mainlevee-garanties-financieres|${entityKey}`,
          //   data,
          // );
          break;

        case 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1':
          // await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
          //   `mainlevee-garanties-financieres|${identifiantProjet}`,
          // );
          break;

        case 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1':
          break;

        case 'DemandeMainlevéeGarantiesFinancièresAccordée-V1':
          // const data: GarantiesFinancières.MainlevéeGarantiesFinancièresEntity = {
          // };

          // await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
          //   `mainlevee-garanties-financieres|${entityKey}`,
          //   data,
          // );
          break;

        case 'DemandeMainlevéeGarantiesFinancièresRejetée-V1':
          // const data: GarantiesFinancières.MainlevéeGarantiesFinancièresEntity = {
          // };

          // await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
          //   `mainlevee-garanties-financieres|${entityKey}`,
          //   data,
          // );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.GarantiesFinancières.Mainlevée', handler);
};
