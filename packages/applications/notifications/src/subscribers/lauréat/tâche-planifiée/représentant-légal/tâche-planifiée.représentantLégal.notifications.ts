import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { handleReprésentantLégalRappelInstructionÀDeuxMois } from './handlers/index.js';

type TâchePlanifiéeExecutéeReprésentantLégalEventPayload = {
  typeTâchePlanifiée: Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal.RawType;
};

export type TâchePlanifiéeReprésentantLégalNotificationProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeReprésentantLégalEventPayload;
};

export const tâchePlanifiéeReprésentantLégalNotifications = (
  props: TâchePlanifiéeReprésentantLégalNotificationProps,
) =>
  match(props.payload)
    .with({ typeTâchePlanifiée: 'représentant-légal.rappel-instruction-à-deux-mois' }, () =>
      handleReprésentantLégalRappelInstructionÀDeuxMois(props),
    )
    .with(
      {
        typeTâchePlanifiée: P.union(
          'représentant-légal.gestion-automatique-demande-changement',
          'représentant-légal.suppression-document-à-trois-mois',
        ),
      },
      () => Promise.resolve(),
    )
    .exhaustive();
