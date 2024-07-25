import { Message, MessageHandler, mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
import { AjouterTâchePlanifiéeCommand } from '../ajouter/ajouterTâchePlanifiée.command';
import { AnnulerTâchePlanifiéeCommand } from '../annuler/annulerTâchePlanifiée.command';

export type SubscriptionEvent =
  | GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent
  | GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent
  | GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent
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
      case 'DépôtGarantiesFinancièresSoumis-V1':
        await mediator.send<AnnulerTâchePlanifiéeCommand>({
          type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresÉchoir,
          },
        });

        await mediator.send<AnnulerTâchePlanifiéeCommand>({
          type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresRappelÉchéanceUnMois,
          },
        });

        await mediator.send<AnnulerTâchePlanifiéeCommand>({
          type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresRappelÉchéanceDeuxMois,
          },
        });
        break;

      case 'DépôtGarantiesFinancièresEnCoursSupprimé-V2':
        if (
          event.payload.garantiesFinancièresActuelles &&
          event.payload.garantiesFinancièresActuelles.type === 'avec-date-échéance' &&
          event.payload.garantiesFinancièresActuelles.dateÉchéance
        ) {
          await ajouterTâchesPlanifiéesGarantiesFinancièresÉchoir(
            identifiantProjet,
            event.payload.garantiesFinancièresActuelles.dateÉchéance,
          );
        }
        break;

      case 'DépôtGarantiesFinancièresEnCoursValidé-V2':
      case 'GarantiesFinancièresModifiées-V1':
      case 'GarantiesFinancièresEnregistrées-V1':
      case 'TypeGarantiesFinancièresImporté-V1':
        if (event.payload.type === 'avec-date-échéance' && event.payload.dateÉchéance) {
          await ajouterTâchesPlanifiéesGarantiesFinancièresÉchoir(
            identifiantProjet,
            event.payload.dateÉchéance,
          );
        }

        break;
    }
  };

  mediator.register('System.Saga.TâchePlanifiéeGarantiesFinancières', handler);
};

const ajouterTâchesPlanifiéesGarantiesFinancièresÉchoir = async (
  identifiantProjet: IdentifiantProjet.RawType,
  dateÉchéance: DateTime.RawType,
) => {
  await mediator.send<AjouterTâchePlanifiéeCommand>({
    type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresÉchoir,
      àExécuterLe: DateTime.convertirEnValueType(dateÉchéance).ajouterNombreDeJours(1),
    },
  });

  const dateRelanceMoinsUnMois = DateTime.convertirEnValueType(dateÉchéance).retirerNombreDeMois(1);

  const dateRelanceMoinsDeuxMois =
    DateTime.convertirEnValueType(dateÉchéance).retirerNombreDeMois(2);

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
};
