import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from '../../../../domain/src/raccordement/propositionTechniqueEtFinancière/enregistrerPropositionTechniqueEtFinancièreSignée/propositionTechniqueEtFinancièreSignéeTransmise.event';
export type PropositionTechniqueEtFinancièreSignéeTransmiseDependencies = {
  find: Find;
  update: Update;
};
/**
 * @deprecated
 */
export declare const propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreSignéeTransmiseEvent,
  PropositionTechniqueEtFinancièreSignéeTransmiseDependencies
>;
//# sourceMappingURL=propositionTechniqueEtFinanci%C3%A8reSign%C3%A9eTransmise.handler.d.ts.map
