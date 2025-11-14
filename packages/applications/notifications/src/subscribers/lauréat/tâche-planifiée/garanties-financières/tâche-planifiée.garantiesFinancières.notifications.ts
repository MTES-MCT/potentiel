import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import {
  handleGarantiesFinancièresRappelEnAttente,
  handleGarantiesFinancièresRappelÉchéance,
} from './handlers.js';

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
) =>
  match(props.payload)
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-échéance-un-mois' }, () =>
      handleGarantiesFinancièresRappelÉchéance({ ...props, nombreDeMois: 1 }),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-échéance-deux-mois' }, () =>
      handleGarantiesFinancièresRappelÉchéance({ ...props, nombreDeMois: 2 }),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-échéance-trois-mois' }, () =>
      handleGarantiesFinancièresRappelÉchéance({ ...props, nombreDeMois: 3 }),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.rappel-en-attente' }, () =>
      handleGarantiesFinancièresRappelEnAttente(props),
    )
    .with({ typeTâchePlanifiée: 'garanties-financières.échoir' }, () => Promise.resolve())
    .exhaustive();
