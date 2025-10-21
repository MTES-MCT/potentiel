import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '../../../../sendEmail';

import { demandeComplèteRaccordementAttendueRelanceNotification } from './demandeComplèteRaccordementAttendueRelance.notification';

type TâchePlanifiéeExecutéeRaccordementEventPayload = {
  typeTâchePlanifiée: Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement.RawType;
};

export type TâchePlanifiéeRaccordementNotificationProps = {
  sendEmail: SendEmail;
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeRaccordementEventPayload;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const tâchePlanifiéeRaccordementNotifications = (
  props: TâchePlanifiéeRaccordementNotificationProps,
) => {
  return match(props.payload)
    .with(
      {
        typeTâchePlanifiée: P.union(
          'demande-complète-raccordement.première-relance-deux-mois',
          'demande-complète-raccordement.relance-un-mois',
        ),
      },
      () => demandeComplèteRaccordementAttendueRelanceNotification(props),
    )
    .exhaustive();
};
