import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { propositionTechniqueEtFinancièreModifiéeHandlerFactory } from '../../../../domain-views/src/raccordement/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import { propositionTechniqueEtFinancièreTransmiseHandlerFactory } from '../../../../domain-views/src/raccordement/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory } from '../../../../domain-views/src/raccordement/handlers/propositionTechniqueEtFinancièreSignéeTransmise.handler';
import { PropostionTechniqueEtFinancièreDependencies } from './propositionTechniqueEtFinancière.dependencies';
import { registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand } from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { registerConsulterPropositionTechniqueEtFinancièreSignéeQuery } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import { registerConsulterPropositionTechniqueEtFinancièreUseCase } from './consulterPropositionTechniqueEtFinancière.usecase';
import { registerModifierPropositiontechniqueEtFinancièreUseCase } from './modifierPropositiontechniqueEtFinancière.usecase';
import { registerTransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettrePropositionTechniqueEtFinancière.usecase';
import { registerModifierPropositionTechniqueEtFinancièreSignéeCommand } from './modifierPropositionTechniqueEtFinancièreSignée/modifierPropositionTechniqueEtFinancièreSignée.command';

export const setupPropostionTechniqueEtFinancière = (
  dependencies: PropostionTechniqueEtFinancièreDependencies,
) => {
  // Queries
  registerConsulterPropositionTechniqueEtFinancièreSignéeQuery(dependencies);

  // Commands
  registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand(dependencies);
  registerModifierPropositionTechniqueEtFinancièreSignéeCommand(dependencies);
  registerModifierPropositionTechniqueEtFinancièreCommand(dependencies);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(dependencies);

  // Usecases
  registerConsulterPropositionTechniqueEtFinancièreUseCase();
  registerModifierPropositiontechniqueEtFinancièreUseCase();
  registerTransmettrePropositionTechniqueEtFinancièreUseCase();

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe(
      'PropositionTechniqueEtFinancièreModifiée',
      propositionTechniqueEtFinancièreModifiéeHandlerFactory(dependencies),
    ),
    subscribe(
      'PropositionTechniqueEtFinancièreTransmise',
      propositionTechniqueEtFinancièreTransmiseHandlerFactory(dependencies),
    ),
    subscribe(
      'PropositionTechniqueEtFinancièreSignéeTransmise',
      propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory(dependencies),
    ),
  ];
};
