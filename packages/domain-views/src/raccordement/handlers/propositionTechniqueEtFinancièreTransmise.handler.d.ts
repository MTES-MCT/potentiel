import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from '../../../../domain/src/raccordement/transmettre/propositionTechniqueEtFinancièreTransmise.event';
export type PropositionTechniqueEtFinancièreTransmiseDependencies = {
  find: Find;
  update: Update;
};
/**
 * @deprecated
 */
export declare const propositionTechniqueEtFinancièreTransmiseHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreTransmiseEvent,
  PropositionTechniqueEtFinancièreTransmiseDependencies
>;
//# sourceMappingURL=propositionTechniqueEtFinanci%C3%A8reTransmise.handler.d.ts.map
