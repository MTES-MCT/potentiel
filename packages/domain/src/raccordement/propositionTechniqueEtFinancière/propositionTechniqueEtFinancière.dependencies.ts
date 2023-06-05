import { Subscribe } from '@potentiel/core-domain';
import { ModifierPropositionTechniqueEtFinancièreDependencies } from './modifier/modifierPropositiontechniqueEtFinancière.command';
import { TransmettrePropositionTechniqueEtFinancièreDependencies } from './transmettre/transmettrePropositionTechniqueEtFinancière.command';
import { PropositionTechniqueEtFinancièreModifiéeDependencies } from '../../../../domain-views/src/raccordement/handlers/propositiontechniqueEtFinancièreModifiée.handler';
import { PropositionTechniqueEtFinancièreTransmiseDependencies } from '../../../../domain-views/src/raccordement/handlers/propositionTechniqueEtFinancièreTransmise.handler';
import { EnregistrerPropositionTechniqueEtFinancièreSignéeDependencies } from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { PropositionTechniqueEtFinancièreSignéeTransmiseDependencies } from '../../../../domain-views/src/raccordement/handlers/propositionTechniqueEtFinancièreSignéeTransmise.handler';
import { ConsulterPropositionTechniqueEtFinancièreSignéeDependencies } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import { ModifierPropositionTechniqueEtFinancièreSignéeDependencies } from './modifierPropositionTechniqueEtFinancièreSignée/modifierPropositionTechniqueEtFinancièreSignée.command';

type QueryHandlerDependencies = ConsulterPropositionTechniqueEtFinancièreSignéeDependencies;

type CommandHandlerDependencies = EnregistrerPropositionTechniqueEtFinancièreSignéeDependencies &
  ModifierPropositionTechniqueEtFinancièreSignéeDependencies &
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
