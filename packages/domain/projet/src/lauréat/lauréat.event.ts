import type { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event';
import type { LauréatModifiéEvent } from './modifier/lauréatModifié.event';
import type {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';

export type LauréatEvent =
  | LauréatNotifiéEvent
  | LauréatNotifiéV1Event
  | NomEtLocalitéLauréatImportésEvent
  | LauréatModifiéEvent
  | CahierDesChargesChoisiEvent;
