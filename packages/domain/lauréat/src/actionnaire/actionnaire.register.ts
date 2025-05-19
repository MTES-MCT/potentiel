import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerImporterActionnaireCommand } from './importer/importerActionnaire.command';
import {
  ConsulterActionnaireDependencies,
  registerConsulterActionnaireQuery,
} from './consulter/consulterActionnaire.query';
import { registerAccorderChangementActionnaireCommand } from './changement/accorder/accorderChangementActionnairet.command';
import { registerAccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase';
import { registerAnnulerDemandeChangementCommand } from './changement/annuler/annulerChangementActionnaire.command';
import { registerAnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase';
import { registerConsulterChangementActionnaireQuery } from './changement/consulter/consulterChangementActionnaire.query';
import { registerDemanderChangementActionnaireCommand } from './changement/demander/demanderChangementActionnaire.command';
import { registerDemanderChangementActionnaireUseCase } from './changement/demander/demanderChangementActionnaire.usecase';
import { registerRejeterChangementActionnaireCommand } from './changement/rejeter/rejeterChangementActionnaire.command';
import { registerRejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase';
import {
  ListerChangementActionnaireDependencies,
  registerListerChangementActionnaireQuery,
} from './changement/lister/listerChangementActionnaire.query';
import { registerSupprimerChangementActionnaireCommand } from './changement/supprimer/supprimerChangementActionnaire.command';
import { registerModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { registerModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import { registerEnregistrerChangementActionnaireUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import { registerEnregistrerChangementActionnaireCommand } from './changement/enregistrerChangement/enregistrerChangement.command';

export type ActionnaireQueryDependencies = ConsulterActionnaireDependencies &
  ListerChangementActionnaireDependencies;

export type ActionnaireCommandDependencies = {
  loadAggregate: LoadAggregate;
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerActionnaireUseCases = ({
  loadAggregate,
  getProjetAggregateRoot,
}: ActionnaireCommandDependencies) => {
  registerImporterActionnaireCommand(loadAggregate, getProjetAggregateRoot);
  registerModifierActionnaireCommand(loadAggregate);
  registerEnregistrerChangementActionnaireCommand(loadAggregate, getProjetAggregateRoot);
  registerDemanderChangementActionnaireCommand(loadAggregate, getProjetAggregateRoot);
  registerAnnulerDemandeChangementCommand(loadAggregate);
  registerAccorderChangementActionnaireCommand(loadAggregate);
  registerRejeterChangementActionnaireCommand(loadAggregate);
  registerSupprimerChangementActionnaireCommand(loadAggregate);

  registerModifierActionnaireUseCase();
  registerEnregistrerChangementActionnaireUseCase();
  registerDemanderChangementActionnaireUseCase();
  registerAnnulerChangementActionnaireUseCase();
  registerAccorderChangementActionnaireUseCase();
  registerRejeterChangementActionnaireUseCase();
};

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerConsulterActionnaireQuery(dependencies);
  registerConsulterChangementActionnaireQuery(dependencies);
  registerListerChangementActionnaireQuery(dependencies);
};
