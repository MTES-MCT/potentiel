import { registerTéléchargerFichierPropositionTechniqueEtFinancièreQuery } from './consulter/téléchargerFichierPropositionTechniqueEtFinancière.query';
import { registerModifierPropositionTechniqueEtFinancièreCommand } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { registerTransmettrePropositionTechniqueEtFinancièreCommand } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { propositionTechniqueEtFinancièreModifiéeHandlerFactory } from './modifier/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import { propositionTechniqueEtFinancièreTransmiseHandlerFactory } from './transmettre/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory } from './transmettre/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';
import { PropostionTechniqueEtFinancièreDependencies } from './propositionTechniqueEtFinancière.dependencies';

export const setupPropostionTechniqueEtFinancière = (
  dependencies: PropostionTechniqueEtFinancièreDependencies,
) => {
  // Queries
  registerTéléchargerFichierPropositionTechniqueEtFinancièreQuery(dependencies);

  // Commands
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
      'FichierPropositionTechniqueEtFinancièreTransmis',
      fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory(dependencies),
    ),
  ];
};
