import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';

import {
  ConsulterChangementFournisseurDependencies,
  registerConsulterChangementFournisseurQuery,
} from './changement/consulter/consulterChangementFournisseur.query.js';
import {
  ConsulterFournisseurDependencies,
  registerConsulterFournisseurQuery,
} from './consulter/consulterFournisseur.query.js';
import {
  ListerChangementFournisseurDependencies,
  registerListerChangementFournisseurQuery,
} from './changement/lister/listerChangementFournisseur.query.js';
import { registerModifierÉvaluationCarboneCommand } from './modifier/modifierÉvaluationCarbone.command.js';
import { registerModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase.js';
import {
  ListerHistoriqueFournisseurProjetDependencies,
  registerListerHistoriqueFournisseurProjetQuery,
} from './listerHistorique/listerHistoriqueFournisseurProjet.query.js';
import { registerMettreÀJourFournisseurUseCase } from './changement/miseAJour/common/mettreÀJourFournisseur.usecase.js';
import { registerMettreÀJourFournisseurCommand } from './changement/miseAJour/common/mettreÀJourFournisseur.command.js';

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
