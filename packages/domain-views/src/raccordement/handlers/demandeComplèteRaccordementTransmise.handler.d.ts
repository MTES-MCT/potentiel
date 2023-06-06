import { Create, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { DemandeComplèteRaccordementTransmiseEvent } from '../../../../domain/src/raccordement/transmettre/demandeComplèteRaccordementTransmise.event';
export type DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies = {
  create: Create;
  update: Update;
  find: Find;
};
/**
 * @deprecated
 */
export declare const demandeComplèteRaccordementTransmiseHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementTransmiseEvent,
  DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies
>;
//# sourceMappingURL=demandeCompl%C3%A8teRaccordementTransmise.handler.d.ts.map
