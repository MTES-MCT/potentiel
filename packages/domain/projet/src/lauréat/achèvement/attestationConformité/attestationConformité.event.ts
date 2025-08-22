import type { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';
import type { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';

export type AttestationConformitéEvent =
  | AttestationConformitéTransmiseEvent
  | AttestationConformitéModifiéeEvent;
