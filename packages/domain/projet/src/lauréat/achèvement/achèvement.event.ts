import { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event.js';
import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event.js';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event.js';
import { DateAchèvementTransmiseEvent } from './transmettre/transmettreDateAchèvement.event.js';

export type AchèvementEvent =
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéModifiéeEvent
  | DateAchèvementPrévisionnelCalculéeEvent
  | DateAchèvementTransmiseEvent;

export type {
  AttestationConformitéTransmiseEvent,
  AttestationConformitéModifiéeEvent,
  DateAchèvementPrévisionnelCalculéeEvent,
  DateAchèvementTransmiseEvent,
};
