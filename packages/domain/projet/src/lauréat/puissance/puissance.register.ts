import type { GetProjetAggregateRoot } from '../../index.js';
import { registerAccorderChangementPuissanceCommand } from './changement/accorder/accorderChangementPuissance.command.js';
import { registerAccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase.js';
import { registerAnnulerChangementPuissanceCommand } from './changement/annuler/annulerChangementPuissance.command.js';
import { registerAnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase.js';
import {
  type ConsulterChangementPuissanceDependencies,
  registerConsulterChangementPuissanceQuery,
} from './changement/consulter/consulterChangementPuissance.query.js';
import { registerDemanderChangementPuissanceCommand } from './changement/demander/demanderChangementPuissance.command.js';
import { registerDemanderChangementPuissanceUseCase } from './changement/demander/demanderChangementPuissance.usecase.js';
import { registerEnregistrerChangementPuissanceCommand } from './changement/enregistrerChangement/enregistrerChangementPuissance.command.js';
import { registerEnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase.js';
import {
  type ListerChangementPuissanceDependencies,
  registerListerChangementPuissanceQuery,
} from './changement/lister/listerChangementPuissance.query.js';
import { registerRejeterChangementPuissanceCommand } from './changement/rejeter/rejeterChangementPuissance.command.js';
import { registerRejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase.js';
import { registerSupprimerChangementPuissanceCommand } from './changement/supprimer/supprimerChangementPuissance.command.js';
import {
  type ConsulterPuissanceDependencies,
  registerConsulterPuissanceQuery,
} from './consulter/consulterPuissance.query.js';
import {
  type ListerHistoriquePuissanceProjetDependencies,
  registerListerHistoriquePuissanceProjetQuery,
} from './listerHistorique/listerHistoriquePuissanceProjet.query.js';
import { registerModifierPuissanceCommand } from './modifier/modifierPuissance.command.js';
import { registerModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase.js';

export type PuissanceQueryDependencies = ConsulterPuissanceDependencies &
  ConsulterChangementPuissanceDependencies &
  ListerChangementPuissanceDependencies &
  ListerHistoriquePuissanceProjetDependencies;

export type PuissanceCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerPuissanceUseCases = ({
  getProjetAggregateRoot,
}: PuissanceCommandDependencies) => {
  registerModifierPuissanceUseCase();
  registerDemanderChangementPuissanceUseCase();
  registerAnnulerChangementPuissanceUseCase();
  registerEnregistrerChangementPuissanceUseCase();
  registerAccorderChangementPuissanceUseCase();
  registerRejeterChangementPuissanceUseCase();

  registerModifierPuissanceCommand(getProjetAggregateRoot);
  registerDemanderChangementPuissanceCommand(getProjetAggregateRoot);
  registerAnnulerChangementPuissanceCommand(getProjetAggregateRoot);
  registerSupprimerChangementPuissanceCommand(getProjetAggregateRoot);
  registerEnregistrerChangementPuissanceCommand(getProjetAggregateRoot);
  registerAccorderChangementPuissanceCommand(getProjetAggregateRoot);
  registerRejeterChangementPuissanceCommand(getProjetAggregateRoot);
};

export const registerPuissanceQueries = (dependencies: PuissanceQueryDependencies) => {
  registerConsulterPuissanceQuery(dependencies);
  registerConsulterChangementPuissanceQuery(dependencies);
  registerListerChangementPuissanceQuery(dependencies);
  registerListerHistoriquePuissanceProjetQuery(dependencies);
};
