import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { handleRelanceÉchéanceAchèvement } from './handlers/index.js';

type TâchePlanifiéeExecutéeAchèvementEventPayload = {
  typeTâchePlanifiée: Lauréat.Achèvement.TypeTâchePlanifiéeAchèvement.RawType;
};

export type TâchePlanifiéeAchèvementNotificationProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeAchèvementEventPayload;
};

export const tâchePlanifiéeAchèvementNotifications = (
  props: TâchePlanifiéeAchèvementNotificationProps,
) =>
  match(props.payload)
    .with(
      {
        typeTâchePlanifiée: P.union(
          'achèvement.rappel-échéance-deux-mois',
          'achèvement.rappel-échéance-trois-mois',
          'achèvement.rappel-échéance-un-mois',
        ),
      },
      () => handleRelanceÉchéanceAchèvement(props),
    )
    .exhaustive();
