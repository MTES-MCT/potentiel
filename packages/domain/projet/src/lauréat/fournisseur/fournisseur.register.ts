import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterChangementFournisseurDependencies,
  registerConsulterChangementFournisseurQuery,
} from './changement/consulter/consulterChangementFournisseur.query';
import {
  ConsulterFournisseurDependencies,
  registerConsulterFournisseurQuery,
} from './consulter/consulterFournisseur.query';
import {
  ListerChangementFournisseurDependencies,
  registerListerChangementFournisseurQuery,
} from './changement/lister/listerChangementFournisseur.query';
import { registerModifierÉvaluationCarboneCommand } from './modifier/modifierÉvaluationCarbone.command';
import { registerModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase';
import {
  ListerHistoriqueFournisseurProjetDependencies,
  registerListerHistoriqueFournisseurProjetQuery,
} from './listerHistorique/listerHistoriqueFournisseurProjet.query';
import { registerMettreÀJourFournisseurUseCase } from './changement/miseAJour/common/mettreÀJourFournisseur.usecase';
import { registerMettreÀJourFournisseurCommand } from './changement/miseAJour/common/mettreÀJourFournisseur.command';

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
