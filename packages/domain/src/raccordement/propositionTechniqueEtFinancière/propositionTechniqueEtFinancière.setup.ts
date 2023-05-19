import { Subscribe } from '@potentiel/core-domain';
import {
  TéléchargerFichierPropositionTechniqueEtFinancièreDependencies,
  registerTéléchargerFichierPropositionTechniqueEtFinancièreQuery,
} from './consulter/téléchargerFichierPropositionTechniqueEtFinancière.query';
import {
  ModifierPropositionTechniqueEtFinancièreDependencies,
  registerModifierPropositionTechniqueEtFinancièreCommand,
} from './modifier/modifierPropositiontechniqueEtFinancière.command';
import {
  TransmettrePropositionTechniqueEtFinancièreDependencies,
  registerTransmettrePropositionTechniqueEtFinancièreCommand,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import {
  PropositionTechniqueEtFinancièreModifiéeDependencies,
  propositionTechniqueEtFinancièreModifiéeHandlerFactory,
} from './modifier/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import {
  PropositionTechniqueEtFinancièreTransmiseDependencies,
  propositionTechniqueEtFinancièreTransmiseHandlerFactory,
} from './transmettre/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import {
  FichierPropositionTechniqueEtFinancièreTransmisDependencies,
  fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory,
} from './transmettre/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';

type QueryHandlerDependencies = TéléchargerFichierPropositionTechniqueEtFinancièreDependencies;
type CommandHandlerDependencies = ModifierPropositionTechniqueEtFinancièreDependencies &
  TransmettrePropositionTechniqueEtFinancièreDependencies;
type EventHandlerDependencies = PropositionTechniqueEtFinancièreModifiéeDependencies &
  PropositionTechniqueEtFinancièreTransmiseDependencies &
  FichierPropositionTechniqueEtFinancièreTransmisDependencies;

export type PropostionTechniqueEtFinancièreDependencies = {
  subscribe: Subscribe;
} & QueryHandlerDependencies &
  CommandHandlerDependencies &
  EventHandlerDependencies;

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
