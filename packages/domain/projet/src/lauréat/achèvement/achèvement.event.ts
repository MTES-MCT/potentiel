import type { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event.js';
import type { AttestationConformitéEnregistréeEvent } from './enregistrer/enregistrerAttestationConformité.event.js';
import type { AchèvementModifiéEvent } from './modifier/modifierAchèvement.event.js';
import type { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event.js';
import type { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event.js';
import type { DateAchèvementTransmiseEvent } from './transmettre/transmettreDateAchèvement.event.js';

export type AchèvementEvent =
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéEnregistréeEvent
  | AttestationConformitéModifiéeEvent
  | AchèvementModifiéEvent
  | DateAchèvementPrévisionnelCalculéeEvent
  | DateAchèvementTransmiseEvent;

export type {
  AchèvementModifiéEvent,
  AttestationConformitéEnregistréeEvent,
  AttestationConformitéModifiéeEvent,
  AttestationConformitéTransmiseEvent,
  DateAchèvementPrévisionnelCalculéeEvent,
  DateAchèvementTransmiseEvent,
};
