import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';
import {
  type ConsulterChangementProducteurDependencies,
  registerConsulterChangementProducteurQuery,
} from './changement/consulter/consulterChangementProducteur.query.js';
import { registerEnregistrerChangementProducteurCommand } from './changement/enregistrerChangement/enregistrerChangement.command.js';
import { registerEnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase.js';
import {
  type ListerChangementProducteurDependencies,
  registerListerChangementProducteurQuery,
} from './changement/lister/listerChangementProducteur.query.js';
import {
  type ConsulterProducteurDependencies,
  registerConsulterProducteurQuery,
} from './consulter/consulterProducteur.query.js';
import {
  type ListerHistoriqueProducteurProjetDependencies,
  registerListerHistoriqueProducteurProjetQuery,
} from './listerHistorique/listerHistoriqueProducteurProjet.query.js';
import { registerModifierProducteurCommand } from './modifier/modifierProducteur.command.js';
import { registerModifierProducteurUseCase } from './modifier/modifierProducteur.usecase.js';
import { registerCorrigerNuméroIdentificationCommand } from './numéroIdentification/corriger/corrigerNuméroIdentification.command.js';
import { registerCorrigerNuméroIdentificationUseCase } from './numéroIdentification/corriger/corrigerNuméroIdentification.usecase.js';

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
  registerCorrigerNuméroIdentificationCommand(dependencies.getProjetAggregateRoot);
  registerCorrigerNuméroIdentificationUseCase();
};

export const registerProducteurQueries = (dependencies: ProducteurQueryDependencies) => {
  registerConsulterProducteurQuery(dependencies);
  registerConsulterChangementProducteurQuery(dependencies);
  registerListerChangementProducteurQuery(dependencies);
  registerListerHistoriqueProducteurProjetQuery(dependencies);
};
