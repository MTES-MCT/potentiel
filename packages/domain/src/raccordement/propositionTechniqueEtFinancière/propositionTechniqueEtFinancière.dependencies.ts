import { Subscribe } from '@potentiel/core-domain';
import { TéléchargerFichierPropositionTechniqueEtFinancièreDependencies } from './consulter/téléchargerFichierPropositionTechniqueEtFinancière.query';
import { ModifierPropositionTechniqueEtFinancièreDependencies } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { TransmettrePropositionTechniqueEtFinancièreDependencies } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { PropositionTechniqueEtFinancièreModifiéeDependencies } from './modifier/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import { PropositionTechniqueEtFinancièreTransmiseDependencies } from './transmettre/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { FichierPropositionTechniqueEtFinancièreTransmisDependencies } from './transmettre/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';

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
