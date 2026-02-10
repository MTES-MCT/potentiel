import { GetProjetAggregateRoot } from '../../index.js';

import { registerAccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase.js';
import { registerAccorderChangementActionnaireCommand } from './changement/accorder/accorderChangementActionnairet.command.js';
import { registerAnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase.js';
import { registerConsulterChangementActionnaireQuery } from './changement/consulter/consulterChangementActionnaire.query.js';
import { registerDemanderChangementActionnaireCommand } from './changement/demander/demanderChangementActionnaire.command.js';
import { registerDemanderChangementActionnaireUseCase } from './changement/demander/demanderChangementActionnaire.usecase.js';
import { registerEnregistrerChangementActionnaireCommand } from './changement/enregistrerChangement/enregistrerChangement.command.js';
import { registerEnregistrerChangementActionnaireUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase.js';
import {
  ListerChangementActionnaireDependencies,
  registerListerChangementActionnaireQuery,
} from './changement/lister/listerChangementActionnaire.query.js';
import { registerRejeterChangementActionnaireCommand } from './changement/rejeter/rejeterChangementActionnaire.command.js';
import { registerRejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase.js';
import { registerSupprimerChangementActionnaireCommand } from './changement/supprimer/supprimerChangementActionnaire.command.js';
import {
  ConsulterActionnaireDependencies,
  registerConsulterActionnaireQuery,
} from './consulter/consulterActionnaire.query.js';
import {
  ListerHistoriqueActionnaireProjetDependencies,
  registerListerHistoriqueActionnaireProjetQuery,
} from './listerHistorique/listerHistoriqueActionnaireProjet.query.js';
import { registerModifierActionnaireCommand } from './modifier/modifierActionnaire.command.js';
import { registerModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase.js';
import { registerAnnulerChangementActionnaireCommand } from './changement/annuler/annulerChangementActionnaire.command.js';

export type ActionnaireQueryDependencies = ConsulterActionnaireDependencies &
  ListerChangementActionnaireDependencies &
  ListerHistoriqueActionnaireProjetDependencies;

export type ActionnaireCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerActionnaireUseCases = ({
  getProjetAggregateRoot,
}: ActionnaireCommandDependencies) => {
  registerModifierActionnaireUseCase();
  registerDemanderChangementActionnaireUseCase();
  registerAnnulerChangementActionnaireUseCase();
  registerEnregistrerChangementActionnaireUseCase();
  registerAccorderChangementActionnaireUseCase();
  registerRejeterChangementActionnaireUseCase();

  registerModifierActionnaireCommand(getProjetAggregateRoot);
  registerDemanderChangementActionnaireCommand(getProjetAggregateRoot);
  registerAnnulerChangementActionnaireCommand(getProjetAggregateRoot);
  registerSupprimerChangementActionnaireCommand(getProjetAggregateRoot);
  registerEnregistrerChangementActionnaireCommand(getProjetAggregateRoot);
  registerAccorderChangementActionnaireCommand(getProjetAggregateRoot);
  registerRejeterChangementActionnaireCommand(getProjetAggregateRoot);
};

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerListerHistoriqueActionnaireProjetQuery(dependencies);
  registerConsulterActionnaireQuery(dependencies);
  registerConsulterChangementActionnaireQuery(dependencies);
  registerListerChangementActionnaireQuery(dependencies);
};
