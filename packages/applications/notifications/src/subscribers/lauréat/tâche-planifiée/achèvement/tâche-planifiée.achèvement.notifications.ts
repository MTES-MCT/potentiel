import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import { handleRelanceÉchéanceAchèvement } from './handlers/';

type TâchePlanifiéeExecutéeAchèvementEventPayload = {
  typeTâchePlanifiée: Lauréat.Achèvement.TypeTâchePlanifiéeAchèvement.RawType;
};

export type TâchePlanifiéeAchèvementNotificationProps = {
  sendEmail: SendEmail;
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeAchèvementEventPayload;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
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
