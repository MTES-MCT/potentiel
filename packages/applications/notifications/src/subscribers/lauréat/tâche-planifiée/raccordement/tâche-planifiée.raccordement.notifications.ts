import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '../../../../sendEmail';

import { handleDemandeComplèteRaccordementAttendueRelance } from './handlers';

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
        typeTâchePlanifiée: 'demande-complète-raccordement.relance',
      },
      () => handleDemandeComplèteRaccordementAttendueRelance(props),
    )
    .exhaustive();
};
