import { AttestationConformitéEvent } from './attestationConformité';
import { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event';

export type AchèvementEvent = AttestationConformitéEvent | DateAchèvementPrévisionnelCalculéeEvent;
