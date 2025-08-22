import type { GetProjetAggregateRoot } from '../..';
import { registerAccorderChangementPuissanceCommand } from './changement/accorder/accorderChangementPuissance.command';
import { registerAccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase';
import { registerAnnulerChangementPuissanceCommand } from './changement/annuler/annulerChangementPuissance.command';
import { registerAnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase';
import {
  type ConsulterChangementPuissanceDependencies,
  registerConsulterChangementPuissanceQuery,
} from './changement/consulter/consulterChangementPuissance.query';
import { registerDemanderChangementPuissanceCommand } from './changement/demander/demanderChangementPuissance.command';
import { registerDemanderChangementPuissanceUseCase } from './changement/demander/demanderChangementPuissance.usecase';
import { registerEnregistrerChangementPuissanceCommand } from './changement/enregistrerChangement/enregistrerChangementPuissance.command';
import { registerEnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase';
import {
  type ListerChangementPuissanceDependencies,
  registerListerChangementPuissanceQuery,
} from './changement/lister/listerChangementPuissance.query';
import { registerRejeterChangementPuissanceCommand } from './changement/rejeter/rejeterChangementPuissance.command';
import { registerRejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase';
import { registerSupprimerChangementPuissanceCommand } from './changement/supprimer/supprimerChangementPuissance.command';
import {
  type ConsulterPuissanceDependencies,
  registerConsulterPuissanceQuery,
} from './consulter/consulterPuissance.query';
import {
  type ListerHistoriquePuissanceProjetDependencies,
  registerListerHistoriquePuissanceProjetQuery,
} from './listerHistorique/listerHistoriquePuissanceProjet.query';
import { registerModifierPuissanceCommand } from './modifier/modifierPuissance.command';
import { registerModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';

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
