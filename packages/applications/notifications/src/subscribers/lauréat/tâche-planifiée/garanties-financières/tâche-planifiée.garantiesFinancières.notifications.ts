import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import {
  handleGarantiesFinancièresRappelEnAttente,
  handleGarantiesFinancièresRappelÉchéance,
} from './handlers/index.js';

type TâchePlanifiéeExecutéeGarantiesFinancièresEventPayload = {
  typeTâchePlanifiée: Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.RawType;
};

export type TâchePlanifiéeGarantiesFinancièresNotificationProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeGarantiesFinancièresEventPayload;
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
