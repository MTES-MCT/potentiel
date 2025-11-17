import { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event';
import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';
import { DateAchèvementTransmiseEvent } from './transmettre/transmettreDateAchèvement.event';

export type AchèvementEvent =
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéModifiéeEvent
  | DateAchèvementPrévisionnelCalculéeEvent
  | DateAchèvementTransmiseEvent;

export {
  AttestationConformitéTransmiseEvent,
  AttestationConformitéModifiéeEvent,
  DateAchèvementPrévisionnelCalculéeEvent,
  DateAchèvementTransmiseEvent,
};
