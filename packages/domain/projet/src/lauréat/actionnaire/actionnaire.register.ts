import type { GetProjetAggregateRoot } from '../..';
import { registerAccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase';
import { registerAccorderChangementActionnaireCommand } from './changement/accorder/accorderChangementActionnairet.command';
import { registerAnnulerChangementActionnaireCommand } from './changement/annuler/annulerChangementActionnaire.command';
import { registerAnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase';
import { registerConsulterChangementActionnaireQuery } from './changement/consulter/consulterChangementActionnaire.query';
import { registerDemanderChangementActionnaireCommand } from './changement/demander/demanderChangementActionnaire.command';
import { registerDemanderChangementActionnaireUseCase } from './changement/demander/demanderChangementActionnaire.usecase';
import { registerEnregistrerChangementActionnaireCommand } from './changement/enregistrerChangement/enregistrerChangement.command';
import { registerEnregistrerChangementActionnaireUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  type ListerChangementActionnaireDependencies,
  registerListerChangementActionnaireQuery,
} from './changement/lister/listerChangementActionnaire.query';
import { registerRejeterChangementActionnaireCommand } from './changement/rejeter/rejeterChangementActionnaire.command';
import { registerRejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase';
import { registerSupprimerChangementActionnaireCommand } from './changement/supprimer/supprimerChangementActionnaire.command';
import {
  type ConsulterActionnaireDependencies,
  registerConsulterActionnaireQuery,
} from './consulter/consulterActionnaire.query';
import {
  type ListerHistoriqueActionnaireProjetDependencies,
  registerListerHistoriqueActionnaireProjetQuery,
} from './listerHistorique/listerHistoriqueActionnaireProjet.query';
import { registerModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { registerModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';

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
