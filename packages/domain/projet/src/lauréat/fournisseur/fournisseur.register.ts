import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import { registerConsulterChangementFournisseurQuery } from './changement/consulter/consulterChangementFournisseur.query';
import { registerEnregistrerChangementFournisseurCommand } from './changement/enregistrerChangement/enregistrerChangement.command';
import { registerEnregistrerChangementFournisseurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  ConsulterFournisseurDependencies,
  registerConsulterFournisseurQuery,
} from './consulter/consulterFournisseur.query';

export type FournisseurQueryDependencies = ConsulterFournisseurDependencies;

export type FournisseurCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerFournisseurUseCases = (dependencies: FournisseurCommandDependencies) => {
  registerEnregistrerChangementFournisseurCommand(dependencies.getProjetAggregateRoot);
  registerEnregistrerChangementFournisseurUseCase();
};

export const registerFournisseurQueries = (dependencies: FournisseurQueryDependencies) => {
  registerConsulterFournisseurQuery(dependencies);
  registerConsulterChangementFournisseurQuery(dependencies);
};
