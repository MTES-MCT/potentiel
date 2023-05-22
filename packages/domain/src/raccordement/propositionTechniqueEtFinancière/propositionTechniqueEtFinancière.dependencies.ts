import { Subscribe } from '@potentiel/core-domain';
import { ModifierPropositionTechniqueEtFinancièreDependencies } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { TransmettrePropositionTechniqueEtFinancièreDependencies } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { PropositionTechniqueEtFinancièreModifiéeDependencies } from './modifier/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import { PropositionTechniqueEtFinancièreTransmiseDependencies } from './transmettre/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies } from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { PropositionTechniqueEtFinancièreSignéeTransmiseDependencies } from './enregistrerPropositionTechniqueEtFinancièreSignée/handlers/fichierPropositionTechniqueEtFinancièreTransmis.handler';
import { SupprimerPropositionTechniqueEtFinancièreSignéeDependencies } from './supprimerPropositionTechniqueEtFinancièreSignée/supprimerPropositionTechniqueEtFinancièreSignée.command';
import { PropositionTechniqueEtFinancièreSignéeSuppriméeDependencies } from './supprimerPropositionTechniqueEtFinancièreSignée/handlers/propositionTechniqueEtFinancièreSignéeSupprimée.handler';
import { ConsulterPropositionTechniqueEtFinancièreSignéeDependencies } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';

type QueryHandlerDependencies = ConsulterPropositionTechniqueEtFinancièreSignéeDependencies;

type CommandHandlerDependencies = SupprimerPropositionTechniqueEtFinancièreSignéeDependencies &
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies &
  ModifierPropositionTechniqueEtFinancièreDependencies &
  TransmettrePropositionTechniqueEtFinancièreDependencies;

type EventHandlerDependencies = PropositionTechniqueEtFinancièreSignéeSuppriméeDependencies &
  PropositionTechniqueEtFinancièreModifiéeDependencies &
  PropositionTechniqueEtFinancièreTransmiseDependencies &
  PropositionTechniqueEtFinancièreSignéeTransmiseDependencies;

export type PropostionTechniqueEtFinancièreDependencies = {
  subscribe: Subscribe;
} & QueryHandlerDependencies &
  CommandHandlerDependencies &
  EventHandlerDependencies;
