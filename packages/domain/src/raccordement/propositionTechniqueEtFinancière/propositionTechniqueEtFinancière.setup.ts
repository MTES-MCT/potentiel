import { registerTéléchargerFichierPropositionTechniqueEtFinancièreQuery } from './consulter/téléchargerFichierPropositionTechniqueEtFinancière.query';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { propositionTechniqueEtFinancièreModifiéeHandlerFactory } from './modifier/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import { propositionTechniqueEtFinancièreTransmiseHandlerFactory } from './transmettre/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory } from './enregistrerPropositionTechniqueEtFinancièreSignée/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';
import { PropostionTechniqueEtFinancièreDependencies } from './propositionTechniqueEtFinancière.dependencies';
import { registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand } from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';

export const setupPropostionTechniqueEtFinancière = (
  dependencies: PropostionTechniqueEtFinancièreDependencies,
) => {
  // Queries
  registerTéléchargerFichierPropositionTechniqueEtFinancièreQuery(dependencies);

  // Commands
  registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand(dependencies);
  registerModifierPropositionTechniqueEtFinancièreCommand(dependencies);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(dependencies);

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
