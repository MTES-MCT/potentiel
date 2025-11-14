import { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event';
import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';

export type AchèvementEvent =
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéModifiéeEvent
  | DateAchèvementPrévisionnelCalculéeEvent;
