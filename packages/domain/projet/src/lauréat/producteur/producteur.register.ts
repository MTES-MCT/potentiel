import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterChangementProducteurDependencies,
  registerConsulterChangementProducteurQuery,
} from './changement/consulter/consulterChangementProducteur.query';
import { registerEnregistrerChangementProducteurCommand } from './changement/enregistrerChangement/enregistrerChangement.command';
import { registerEnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  ListerChangementProducteurDependencies,
  registerListerChangementProducteurQuery,
} from './changement/lister/listerChangementProducteur.query';
import {
  ConsulterProducteurDependencies,
  registerConsulterProducteurQuery,
} from './consulter/consulterProducteur.query';
import {
  ListerHistoriqueProducteurProjetDependencies,
  registerListerHistoriqueProducteurProjetQuery,
} from './listerHistorique/listerHistoriqueProducteurProjet.query';
import { registerModifierProducteurCommand } from './modifier/modifierProducteur.command';
import { registerModifierProducteurUseCase } from './modifier/modifierProducteur.usecase';

export type ProducteurQueryDependencies = ConsulterProducteurDependencies &
  ConsulterChangementProducteurDependencies &
  ListerChangementProducteurDependencies &
  ListerHistoriqueProducteurProjetDependencies;

export type ProducteurCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerProducteurUseCases = (dependencies: ProducteurCommandDependencies) => {
  registerEnregistrerChangementProducteurCommand(dependencies.getProjetAggregateRoot);
  registerEnregistrerChangementProducteurUseCase();
  registerModifierProducteurCommand(dependencies.getProjetAggregateRoot);
  registerModifierProducteurUseCase();
};

export const registerProducteurQueries = (dependencies: ProducteurQueryDependencies) => {
  registerConsulterProducteurQuery(dependencies);
  registerConsulterChangementProducteurQuery(dependencies);
  registerListerChangementProducteurQuery(dependencies);
  registerListerHistoriqueProducteurProjetQuery(dependencies);
};
