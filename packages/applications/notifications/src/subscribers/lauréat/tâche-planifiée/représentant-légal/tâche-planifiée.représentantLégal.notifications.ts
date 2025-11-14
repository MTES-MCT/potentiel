import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import { handleReprésentantLégalRappelInstructionÀDeuxMois } from "./handlers.js";

type TâchePlanifiéeExecutéeReprésentantLégalEventPayload = {
  typeTâchePlanifiée: Lauréat.ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal.RawType;
};

export type TâchePlanifiéeReprésentantLégalNotificationProps = {
  sendEmail: SendEmail;
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: TâchePlanifiéeExecutéeReprésentantLégalEventPayload;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const tâchePlanifiéeReprésentantLégalNotifications = (
  props: TâchePlanifiéeReprésentantLégalNotificationProps,
) => {
  return match(props.payload)
    .with({ typeTâchePlanifiée: 'représentant-légal.rappel-instruction-à-deux-mois' }, () =>
      handleReprésentantLégalRappelInstructionÀDeuxMois(props),
    )
    .with({ typeTâchePlanifiée: 'représentant-légal.gestion-automatique-demande-changement' }, () =>
      Promise.resolve(),
    )
    .with({ typeTâchePlanifiée: 'représentant-légal.suppression-document-à-trois-mois' }, () =>
      Promise.resolve(),
    )
    .exhaustive();
};
