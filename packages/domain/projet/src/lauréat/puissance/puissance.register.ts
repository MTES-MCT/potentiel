import { GetProjetAggregateRoot } from '../../index.js';

import {
  ConsulterPuissanceDependencies,
  registerConsulterPuissanceQuery,
} from './consulter/consulterPuissance.query.js';
import { registerModifierPuissanceCommand } from './modifier/modifierPuissance.command.js';
import { registerModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase.js';
import { registerDemanderChangementPuissanceCommand } from './changement/demander/demanderChangementPuissance.command.js';
import { registerDemanderChangementPuissanceUseCase } from './changement/demander/demanderChangementPuissance.usecase.js';
import {
  ConsulterChangementPuissanceDependencies,
  registerConsulterChangementPuissanceQuery,
} from './changement/consulter/consulterChangementPuissance.query.js';
import { registerAnnulerChangementPuissanceCommand } from './changement/annuler/annulerChangementPuissance.command.js';
import { registerAnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase.js';
import { registerSupprimerChangementPuissanceCommand } from './changement/supprimer/supprimerChangementPuissance.command.js';
import { registerAccorderChangementPuissanceUseCase } from './changement/accorder/accorderChangementPuissance.usecase.js';
import { registerAccorderChangementPuissanceCommand } from './changement/accorder/accorderChangementPuissance.command.js';
import { registerEnregistrerChangementPuissanceCommand } from './changement/enregistrerChangement/enregistrerChangementPuissance.command.js';
import { registerEnregistrerChangementPuissanceUseCase } from './changement/enregistrerChangement/enregistrerChangementPuissance.usecase.js';
import { registerRejeterChangementPuissanceUseCase } from './changement/rejeter/rejeterChangementPuissance.usecase.js';
import { registerRejeterChangementPuissanceCommand } from './changement/rejeter/rejeterChangementPuissance.command.js';
import {
  ListerChangementPuissanceDependencies,
  registerListerChangementPuissanceQuery,
} from './changement/lister/listerChangementPuissance.query.js';
import {
  ListerHistoriquePuissanceProjetDependencies,
  registerListerHistoriquePuissanceProjetQuery,
} from './listerHistorique/listerHistoriquePuissanceProjet.query.js';
import { registerConsulterVolumeRéservéQuery } from './consulter/consulterVolumeRéservé.query.js';

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
  registerConsulterVolumeRéservéQuery(dependencies);
};
