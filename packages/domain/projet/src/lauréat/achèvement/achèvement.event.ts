import { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event.js';
import { AttestationConformitéEnregistréeEvent } from './enregistrer/enregistrerAttestationConformité.event.js';
import { AchèvementModifiéEvent } from './modifier/modifierAchèvement.event.js';
import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event.js';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event.js';
import { DateAchèvementTransmiseEvent } from './transmettre/transmettreDateAchèvement.event.js';

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
