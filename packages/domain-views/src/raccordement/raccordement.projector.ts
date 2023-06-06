import { Update, Find, Create, Remove } from '@potentiel/core-domain';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
  ModifierPropositionTechniqueEtFinancièreSignéePort,
  RaccordementEvent,
} from '@potentiel/domain';
import { Message } from 'mediateur';
import { RécupérerPropositionTechniqueEtFinancièreSignéePort } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';

export type ExecuteGestionnaireRéseauProjector = Message<
  'EXECUTE_GESTIONNAIRE_RÉSEAU_PROJECTOR',
  RaccordementEvent
>;

export type RaccordementProjectorDependencies = {
  find: Find;
  update: Update;
  create: Create;
  remove: Remove;
  récupérerPropositionTechniqueEtFinancièreSignée: RécupérerPropositionTechniqueEtFinancièreSignéePort;
  enregistrerPropositionTechniqueEtFinancièreSignée: EnregistrerPropositionTechniqueEtFinancièreSignéePort &
    ModifierPropositionTechniqueEtFinancièreSignéePort;
};
