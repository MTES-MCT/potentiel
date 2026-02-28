import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { handleDemandeComplèteRaccordementAttendueRelance } from './handlers/index.js';

type TâchePlanifiéeExecutéeRaccordementEventPayload = {
  typeTâchePlanifiée: Lauréat.Raccordement.TypeTâchePlanifiéeRaccordement.RawType;
};

export type TâchePlanifiéeRaccordementNotificationProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeRaccordementEventPayload;
};

export const tâchePlanifiéeRaccordementNotifications = (
  props: TâchePlanifiéeRaccordementNotificationProps,
) =>
  match(props.payload)
    .with(
      {
        typeTâchePlanifiée: 'demande-complète-raccordement.relance',
      },
      () => handleDemandeComplèteRaccordementAttendueRelance(props),
    )
    .exhaustive();
