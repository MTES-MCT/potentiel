import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterActionnaireCommand } from './importer/importerActionnaire.command';
import {
  ConsulterActionnaireDependencies,
  registerConsulterActionnaireQuery,
} from './consulter/consulterActionnaire.query';
import { registerAccorderDemandeChangementActionnaireCommand } from './changement/accorder/accorderDemandeChangement.command';
import { registerAccorderDemandeChangementActionnaireUseCase } from './changement/accorder/accorderDemandeChangement.usecase';
import { registerAnnulerDemandeChangementCommand } from './changement/annuler/annulerDemandeChangement.command';
import { registerAnnulerDemandeChangementActionnaireUseCase } from './changement/annuler/annulerDemandeChangement.usecase';
import { registerConsulterChangementActionnaireQuery } from './changement/consulter/consulterChangementActionnaire.query';
import { registerDemanderChangementActionnaireCommand } from './changement/demander/demandeChangement.command';
import { registerDemanderChangementActionnaireUseCase } from './changement/demander/demandeChangement.usecase';
import { registerRejeterDemandeChangementActionnaireCommand } from './changement/rejeter/rejeterDemandeChangement.command';
import { registerRejeterDemandeChangementActionnaireUseCase } from './changement/rejeter/rejeterDemandeChangement.usecase';
import { registerModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { registerModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import {
  ListerChangementActionnaireDependencies,
  registerListerChangementActionnaireQuery,
} from './changement/lister/listerChangementActionnaire.query';

export type ActionnaireQueryDependencies = ConsulterActionnaireDependencies &
  ListerChangementActionnaireDependencies;

export type ActionnaireCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerActionnaireUseCases = ({ loadAggregate }: ActionnaireCommandDependencies) => {
  registerImporterActionnaireCommand(loadAggregate);
  registerModifierActionnaireCommand(loadAggregate);
  registerDemanderChangementActionnaireCommand(loadAggregate);
  registerAnnulerDemandeChangementCommand(loadAggregate);
  registerAccorderDemandeChangementActionnaireCommand(loadAggregate);
  registerRejeterDemandeChangementActionnaireCommand(loadAggregate);

  registerModifierActionnaireUseCase();
  registerDemanderChangementActionnaireUseCase();
  registerAnnulerDemandeChangementActionnaireUseCase();
  registerAccorderDemandeChangementActionnaireUseCase();
  registerRejeterDemandeChangementActionnaireUseCase();
};

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerConsulterActionnaireQuery(dependencies);
  registerConsulterChangementActionnaireQuery(dependencies);
  registerListerChangementActionnaireQuery(dependencies);
};
