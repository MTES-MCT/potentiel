import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { tâchePlanifiéeGarantiesFinancièresNotifications } from './garanties-financières/tâche-planifiée.garantiesFinancières.notifications.js';
import { tâchePlanifiéeReprésentantLégalNotifications } from './représentant-légal/tâche-planifiée.représentantLégal.notifications.js';
import { tâchePlanifiéeRaccordementNotifications } from './raccordement/tâche-planifiée.raccordement.notifications.js';
import { tâchePlanifiéeAchèvementNotifications } from './achèvement/tâche-planifiée.achèvement.notifications.js';

type TypeTâchePlanifiée =
  | Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.RawType
  | Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal.RawType
  | Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement.RawType
  | Lauréat.Achèvement.TypeTâchePlanifiéeAchèvement.RawType;

export type SubscriptionEvent = Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent &
  Event & { payload: { typeTâchePlanifiée: TypeTâchePlanifiée } };

export type Execute = Message<'System.Notification.TâchePlanifiée', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    await match(event.payload)
      .with(
        {
          typeTâchePlanifiée: P.union(
            ...Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.types,
          ),
        },
        (payload) =>
          tâchePlanifiéeGarantiesFinancièresNotifications({
            identifiantProjet,
            payload,
          }),
      )
      .with(
        {
          typeTâchePlanifiée: P.union(
            ...Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal.types,
          ),
        },
        (payload) =>
          tâchePlanifiéeReprésentantLégalNotifications({
            identifiantProjet,
            payload,
          }),
      )
      .with(
        {
          typeTâchePlanifiée: P.union(...Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement.types),
        },
        (payload) =>
          tâchePlanifiéeRaccordementNotifications({
            identifiantProjet,
            payload,
          }),
      )
      .with(
        {
          typeTâchePlanifiée: P.union(...Lauréat.Achèvement.TypeTâchePlanifiéeAchèvement.types),
        },
        (payload) =>
          tâchePlanifiéeAchèvementNotifications({
            identifiantProjet,
            payload,
          }),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.TâchePlanifiée', handler);
};
