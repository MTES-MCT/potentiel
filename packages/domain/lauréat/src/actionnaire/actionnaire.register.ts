import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterActionnaireCommand } from './importer/importerActionnaire.command';
import {
  ConsulterActionnaireDependencies,
  registerConsulterActionnaireQuery,
} from './consulter/consulterActionnaire.query';
import { registerModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import { registerModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { registerDemanderChangementActionnaireUseCase } from './demanderChangement/demandeChangement.usecase';
import { registerDemanderChangementActionnaireCommand } from './demanderChangement/demandeChangement.command';
import { registerAnnulerDemandeChangementCommand } from './annulerDemandeChangement/annulerDemandeChangement.command';
import { registerAnnulerDemandeChangementActionnaireUseCase } from './annulerDemandeChangement/annulerDemandeChangement.usecase';
import { registerConsulterChangementActionnaireQuery } from './consulterDemandeChangement/consulterChangementActionnaire.query';
import { registerAccorderDemandeChangementActionnaireCommand } from './accorderDemandeChangement/accorderDemandeChangement.command';
import { registerAccorderDemandeChangementActionnaireUseCase } from './accorderDemandeChangement/accorderDemandeChangement.usecase';
import { registerRejeterDemandeChangementActionnaireCommand } from './rejeterDemandeChangement/rejeterDemandeChangement.command';
import { registerRejeterDemandeChangementActionnaireUseCase } from './rejeterDemandeChangement/rejeterDemandeChangement.usecase';

export type ActionnaireQueryDependencies = ConsulterActionnaireDependencies;

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
};
