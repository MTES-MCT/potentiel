import { LauréatModifiéEvent } from './modifier/lauréatModifié.event';
import {
  LauréatNotifiéEvent,
  NomEtLocalitéLauréatImportésEvent,
  LauréatNotifiéV1Event,
} from './notifier/lauréatNotifié.event';

export type LauréatEvent =
  | LauréatNotifiéEvent
  | LauréatNotifiéV1Event
  | NomEtLocalitéLauréatImportésEvent
  | LauréatModifiéEvent;
