import type { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event.js';
import type {
  AttestationConformitéEnregistréeEvent,
  AttestationConformitéEnregistréeEventV1,
} from './enregistrer/enregistrerAttestationConformité.event.js';
import type {
  AchèvementModifiéEvent,
  AchèvementModifiéEventV1,
} from './modifier/modifierAchèvement.event.js';
import type {
  AttestationConformitéModifiéeEvent,
  AttestationConformitéModifiéeEventV1,
} from './modifier/modifierAttestationConformité.event.js';
import type {
  AttestationConformitéTransmiseEvent,
  AttestationConformitéTransmiseEventV1,
} from './transmettre/transmettreAttestationConformité.event.js';
import type { DateAchèvementTransmiseEvent } from './transmettre/transmettreDateAchèvement.event.js';

export type AchèvementEvent =
  | AttestationConformitéTransmiseEventV1
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéEnregistréeEventV1
  | AttestationConformitéEnregistréeEvent
  | AttestationConformitéModifiéeEventV1
  | AttestationConformitéModifiéeEvent
  | AchèvementModifiéEventV1
  | AchèvementModifiéEvent
  | DateAchèvementPrévisionnelCalculéeEvent
  | DateAchèvementTransmiseEvent;

export type {
  AchèvementModifiéEvent,
  AchèvementModifiéEventV1,
  AttestationConformitéEnregistréeEvent,
  AttestationConformitéEnregistréeEventV1,
  AttestationConformitéModifiéeEvent,
  AttestationConformitéModifiéeEventV1,
  AttestationConformitéTransmiseEvent,
  AttestationConformitéTransmiseEventV1,
  DateAchèvementPrévisionnelCalculéeEvent,
  DateAchèvementTransmiseEvent,
};
