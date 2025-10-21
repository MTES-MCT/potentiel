import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat } from '../../../helpers';
import { SendEmail } from '../../../sendEmail';

import { tâchePlanifiéeGarantiesFinancièresNotifications } from './garanties-financières';
import { tâchePlanifiéeReprésentantLégalNotifications } from './représentant-légal';
import { tâchePlanifiéeRaccordementNotifications } from './raccordement';

type TypeTâchePlanifiée =
  | Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.RawType
  | Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal.RawType
  | Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement.RawType;

export type SubscriptionEvent = Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent &
  Event & { payload: { typeTâchePlanifiée: TypeTâchePlanifiée } };

export type Execute = Message<'System.Notification.TâchePlanifiée', SubscriptionEvent>;

export type RegisterTâchePlanifiéeNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterTâchePlanifiéeNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const baseUrl = getBaseUrl();

    const projet = await getLauréat(identifiantProjet.formatter());

    await match(event.payload)
      .with(
        {
          typeTâchePlanifiée: P.union(
            ...Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.types,
          ),
        },
        (payload) =>
          tâchePlanifiéeGarantiesFinancièresNotifications({
            baseUrl,
            identifiantProjet,
            projet,
            sendEmail,
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
            sendEmail,
            identifiantProjet,
            projet,
            baseUrl,
            payload,
          }),
      )
      .with(
        {
          typeTâchePlanifiée: P.union(...Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement.types),
        },
        (payload) =>
          tâchePlanifiéeRaccordementNotifications({
            sendEmail,
            identifiantProjet,
            projet,
            baseUrl,
            payload,
          }),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.TâchePlanifiée', handler);
};
