import { Message, MessageHandler, mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
import { AjouterTâchePlanifiéeCommand } from '../ajouter/ajouterTâchePlanifiée.command';

export type SubscriptionEvent =
  | GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent
  | GarantiesFinancières.GarantiesFinancièresModifiéesEvent
  | GarantiesFinancières.GarantiesFinancièresEnregistréesEvent
  | GarantiesFinancières.TypeGarantiesFinancièresImportéEvent;

export type Execute = Message<'System.Saga.TâchePlanifiéeGarantiesFinancières', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'DépôtGarantiesFinancièresEnCoursValidé-V2':
      case 'GarantiesFinancièresModifiées-V1':
      case 'GarantiesFinancièresEnregistrées-V1':
        // case 'TypeGarantiesFinancièresImporté-V1':
        if (event.payload.type === 'avec-date-échéance' && event.payload.dateÉchéance) {
          await mediator.send<AjouterTâchePlanifiéeCommand>({
            type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresÉchoir,
              àExécuterLe: DateTime.convertirEnValueType(
                event.payload.dateÉchéance,
              ).ajouterNombreDeJours(1),
            },
          });

          const dateRelanceMoinsUnMois = DateTime.convertirEnValueType(
            event.payload.dateÉchéance,
          ).retirerNombreDeMois(1);

          const dateRelanceMoinsDeuxMois = DateTime.convertirEnValueType(
            event.payload.dateÉchéance,
          ).retirerNombreDeMois(2);

          await mediator.send<AjouterTâchePlanifiéeCommand>({
            type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresRappelÉchéanceUnMois,
              àExécuterLe: dateRelanceMoinsUnMois,
            },
          });
          await mediator.send<AjouterTâchePlanifiéeCommand>({
            type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresRappelÉchéanceDeuxMois,
              àExécuterLe: dateRelanceMoinsDeuxMois,
            },
          });
        }

        break;
    }
  };

  mediator.register('System.Saga.TâchePlanifiéeGarantiesFinancières', handler);
};
