import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { DateMiseEnServiceTransmiseEvent } from '../../../../domain/src/raccordement/transmettre/dateMiseEnServiceTransmise.event';
export type DateMiseEnServiceTransmiseDependencies = {
  find: Find;
  update: Update;
};
/**
 * @deprecated
 */
export declare const dateMiseEnServiceTransmiseHandlerFactory: DomainEventHandlerFactory<
  DateMiseEnServiceTransmiseEvent,
  DateMiseEnServiceTransmiseDependencies
>;
//# sourceMappingURL=dateMiseEnServiceTransmise.handler.d.ts.map
