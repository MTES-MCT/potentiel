import { Subscribe } from '@potentiel/core-domain';
import { TéléchargerFichierPropositionTechniqueEtFinancièreDependencies } from './consulter/téléchargerFichierPropositionTechniqueEtFinancière.query';
import { ModifierPropositionTechniqueEtFinancièreDependencies } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { TransmettrePropositionTechniqueEtFinancièreDependencies } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { PropositionTechniqueEtFinancièreModifiéeDependencies } from './modifier/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import { PropositionTechniqueEtFinancièreTransmiseDependencies } from './transmettre/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies } from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { PropositionTechniqueEtFinancièreSignéeTransmiseDependencies } from './enregistrerPropositionTechniqueEtFinancièreSignée/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';

type QueryHandlerDependencies = TéléchargerFichierPropositionTechniqueEtFinancièreDependencies;

type CommandHandlerDependencies =
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies &
    ModifierPropositionTechniqueEtFinancièreDependencies &
    TransmettrePropositionTechniqueEtFinancièreDependencies;

type EventHandlerDependencies = PropositionTechniqueEtFinancièreModifiéeDependencies &
  PropositionTechniqueEtFinancièreTransmiseDependencies &
  PropositionTechniqueEtFinancièreSignéeTransmiseDependencies;

export type PropostionTechniqueEtFinancièreDependencies = {
  subscribe: Subscribe;
} & QueryHandlerDependencies &
  CommandHandlerDependencies &
  EventHandlerDependencies;
