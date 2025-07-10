import { AttestationConformitéEvent } from './attestationConformité';
import { DatePrévisionnelleCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event';

export type AchèvementEvent = AttestationConformitéEvent | DatePrévisionnelleCalculéeEvent;
