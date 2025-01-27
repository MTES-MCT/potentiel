import { LoadAggregate } from '@potentiel-domain/core';

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
import { registerConsulterDateChangementActionnaireQuery } from './changement/consulter/consulterDateChangementActionnaire.query';

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
  registerAccorderChangementActionnaireCommand(loadAggregate);
  registerRejeterChangementActionnaireCommand(loadAggregate);
  registerSupprimerChangementActionnaireCommand(loadAggregate);

  registerModifierActionnaireUseCase();
  registerDemanderChangementActionnaireUseCase();
  registerAnnulerChangementActionnaireUseCase();
  registerAccorderChangementActionnaireUseCase();
  registerRejeterChangementActionnaireUseCase();
};

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerConsulterActionnaireQuery(dependencies);
  registerConsulterChangementActionnaireQuery(dependencies);
  registerConsulterDateChangementActionnaireQuery(dependencies);
  registerListerChangementActionnaireQuery(dependencies);
};
