import { GarantiesFinancièresActuellesEvent } from './actuelles/garantiesFinancièresActuelles.event';
import { DépôtGarantiesFinancièresEvent } from './dépôt/depôtGarantiesFinancières.event';
import { MainlevéeGarantiesFinancièresEvent } from './mainlevée/mainlevéeGarantiesFinancières.event';

export * from './actuelles/garantiesFinancièresActuelles.event';
export * from './dépôt/depôtGarantiesFinancières.event';
export * from './mainlevée/mainlevéeGarantiesFinancières.event';

export type GarantiesFinancièresEvent =
  | GarantiesFinancièresActuellesEvent
  | DépôtGarantiesFinancièresEvent
  | MainlevéeGarantiesFinancièresEvent;
