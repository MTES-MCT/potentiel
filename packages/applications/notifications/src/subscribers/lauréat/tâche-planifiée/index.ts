import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat } from '../../../helpers';
import { SendEmail } from '../../../sendEmail';

import { garantiesFinancièresRappelÉchéanceNotification } from './garantiesFinancièresRappelÉchéance.notification';
import { représentantLégalRappelInstructionÀDeuxMoisNotification } from './représentantLégalRappelInstructionÀDeuxMois.notification';

export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent & Event;

export type Execute = Message<'System.Notification.TâchePlanifiée', SubscriptionEvent>;

export type RegisterTâchePlanifiéeNotificationDependencies = {
  sendEmail: SendEmail;
};

type TâchePlanifiée =
  | GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.RawType
  | Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal.RawType;

export const register = ({ sendEmail }: RegisterTâchePlanifiéeNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const baseUrl = getBaseUrl();

    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event.payload.typeTâchePlanifiée as TâchePlanifiée)
      .with(
        P.union(
          'garanties-financières.rappel-échéance-un-mois',
          'garanties-financières.rappel-échéance-deux-mois',
        ),
        async () =>
          garantiesFinancièresRappelÉchéanceNotification({
            sendEmail,
            identifiantProjet,
            event,
            projet,
            baseUrl,
          }),
      )
      .with('représentant-légal.rappel-instruction-à-deux-mois', async () =>
        représentantLégalRappelInstructionÀDeuxMoisNotification({
          sendEmail,
          identifiantProjet,
          projet,
          baseUrl,
        }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.TâchePlanifiée', handler);
};
