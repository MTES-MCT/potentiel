import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';

export type AchèvementEvent =
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéModifiéeEvent;
