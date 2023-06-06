import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from '../../../../domain/src/raccordement/propositionTechniqueEtFinancière/modifier/propositionTechniqueEtFinancièreModifiée.event';
export type PropositionTechniqueEtFinancièreModifiéeDependencies = {
  find: Find;
  update: Update;
};
/**
 * @deprecated
 */
export declare const propositionTechniqueEtFinancièreModifiéeHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreModifiéeDependencies
>;
//# sourceMappingURL=propositiontechniqueEtFinanci%C3%A8reModifi%C3%A9e.handler.d.ts.map
