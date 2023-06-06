import { Create, Remove, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { DemandeComplèteRaccordementModifiéeEvent } from '../../../../domain/src/raccordement/modifier/demandeComplèteRaccordementModifiée.event';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
  RécupérerPropositionTechniqueEtFinancièreSignéePort,
} from '../../../../domain/src/raccordement/raccordement.ports';
import { ModifierPropositionTechniqueEtFinancièreSignéePort } from '../../../../domain/src/raccordement/modifier/modifierPropositionTechniqueEtFinancièreSignée.command';
export type DemandeComplèteRaccordementeModifiéeDependencies = {
  find: Find;
  create: Create;
  remove: Remove;
  update: Update;
  récupérerPropositionTechniqueEtFinancièreSignée: RécupérerPropositionTechniqueEtFinancièreSignéePort;
  enregistrerPropositionTechniqueEtFinancièreSignée: EnregistrerPropositionTechniqueEtFinancièreSignéePort &
    ModifierPropositionTechniqueEtFinancièreSignéePort;
};
/**
 * @deprecated
 */
export declare const demandeComplèteRaccordementeModifiéeHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementeModifiéeDependencies
>;
//# sourceMappingURL=demandeCompl%C3%A8teRaccordementModifi%C3%A9e.handler.d.ts.map
