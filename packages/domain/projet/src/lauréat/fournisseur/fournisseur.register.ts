import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';
import {
  type ConsulterChangementFournisseurDependencies,
  registerConsulterChangementFournisseurQuery,
} from './changement/consulter/consulterChangementFournisseur.query.js';
import {
  type ListerChangementFournisseurDependencies,
  registerListerChangementFournisseurQuery,
} from './changement/lister/listerChangementFournisseur.query.js';
import { registerMettreÀJourFournisseurCommand } from './changement/miseAJour/common/mettreÀJourFournisseur.command.js';
import { registerMettreÀJourFournisseurUseCase } from './changement/miseAJour/common/mettreÀJourFournisseur.usecase.js';
import {
  type ConsulterFournisseurDependencies,
  registerConsulterFournisseurQuery,
} from './consulter/consulterFournisseur.query.js';
import {
  type ListerHistoriqueFournisseurProjetDependencies,
  registerListerHistoriqueFournisseurProjetQuery,
} from './listerHistorique/listerHistoriqueFournisseurProjet.query.js';
import { registerModifierÉvaluationCarboneCommand } from './modifier/modifierÉvaluationCarbone.command.js';
import { registerModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase.js';

export type FournisseurQueryDependencies = ConsulterFournisseurDependencies &
  ConsulterChangementFournisseurDependencies &
  ListerChangementFournisseurDependencies &
  ListerHistoriqueFournisseurProjetDependencies;

export type FournisseurCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerFournisseurQueries = (dependencies: FournisseurQueryDependencies) => {
  registerConsulterFournisseurQuery(dependencies);
  registerConsulterChangementFournisseurQuery(dependencies);
  registerListerChangementFournisseurQuery(dependencies);
  registerListerHistoriqueFournisseurProjetQuery(dependencies);
};

export const registerFournisseurUseCases = (dependencies: FournisseurCommandDependencies) => {
  registerModifierÉvaluationCarboneUseCase();
  registerModifierÉvaluationCarboneCommand(dependencies.getProjetAggregateRoot);

  registerMettreÀJourFournisseurCommand(dependencies.getProjetAggregateRoot);
  registerMettreÀJourFournisseurUseCase();
};
