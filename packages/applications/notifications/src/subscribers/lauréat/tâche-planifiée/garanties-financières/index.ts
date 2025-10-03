import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '../../../../sendEmail';

import { garantiesFinancièresRappelÉchéanceNotification } from './garantiesFinancièresRappelÉchéance.notification';
import { garantiesFinancièresRappelEnAttenteNotification } from './garantiesFinancièresRappelEnAttente.notification';

type TâchePlanifiéeExecutéeGarantiesFinancièresEventPayload = {
  typeTâchePlanifiée: Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.RawType;
};

export type TâchePlanifiéeGarantiesFinancièresNotificationProps = {
  sendEmail: SendEmail;
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeGarantiesFinancièresEventPayload;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const tâchePlanifiéeGarantiesFinancièresNotifications = (
  props: TâchePlanifiéeGarantiesFinancièresNotificationProps,
) => {
  return match(props.payload)
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-échéance-un-mois' }, () =>
      garantiesFinancièresRappelÉchéanceNotification({ ...props, nombreDeMois: 1 }),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-échéance-deux-mois' }, () =>
      garantiesFinancièresRappelÉchéanceNotification({ ...props, nombreDeMois: 2 }),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-échéance-trois-mois' }, () =>
      garantiesFinancièresRappelÉchéanceNotification({ ...props, nombreDeMois: 3 }),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-en-attente' }, () =>
      garantiesFinancièresRappelEnAttenteNotification(props),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.échoir' }, () => Promise.resolve())
    .exhaustive();
};
