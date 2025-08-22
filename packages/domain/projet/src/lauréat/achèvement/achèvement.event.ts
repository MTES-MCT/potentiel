import type { AttestationConformitéEvent } from './attestationConformité';
import type { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event';

export type AchèvementEvent = AttestationConformitéEvent | DateAchèvementPrévisionnelCalculéeEvent;
