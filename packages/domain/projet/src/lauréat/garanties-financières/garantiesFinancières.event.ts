import { GarantiesFinancièresActuellesEvent } from './actuelles/garantiesFinancièresActuelles.event.js';
import { DépôtGarantiesFinancièresEvent } from './dépôt/depôtGarantiesFinancières.event.js';
import { MainlevéeGarantiesFinancièresEvent } from './mainlevée/mainlevéeGarantiesFinancières.event.js';

export type * from './actuelles/garantiesFinancièresActuelles.event.js';
export type * from './dépôt/depôtGarantiesFinancières.event.js';
export type * from './mainlevée/mainlevéeGarantiesFinancières.event.js';

export type GarantiesFinancièresEvent =
  | GarantiesFinancièresActuellesEvent
  | DépôtGarantiesFinancièresEvent
  | MainlevéeGarantiesFinancièresEvent;
