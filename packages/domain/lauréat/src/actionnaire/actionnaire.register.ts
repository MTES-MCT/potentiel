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
import { registerConsulterChangementActionnaireQuery } from './consulterChangement/consulterChangementActionnaire.query';
import { registerAnnulerDemandeChangementCommand } from './annulerDemandeChangement/annulerDemandeChangement.command';
import { registerAnnulerDemandeChangementActionnaireUseCase } from './annulerDemandeChangement/annulerDemandeChangement.usecase';

export type ActionnaireQueryDependencies = ConsulterActionnaireDependencies;

export type ActionnaireCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerActionnaireUseCases = ({ loadAggregate }: ActionnaireCommandDependencies) => {
  registerImporterActionnaireCommand(loadAggregate);
  registerModifierActionnaireCommand(loadAggregate);
  registerDemanderChangementActionnaireCommand(loadAggregate);
  registerAnnulerDemandeChangementCommand(loadAggregate);

  registerModifierActionnaireUseCase();
  registerDemanderChangementActionnaireUseCase();
  registerAnnulerDemandeChangementActionnaireUseCase();
};

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerConsulterActionnaireQuery(dependencies);
  registerConsulterChangementActionnaireQuery(dependencies);
};
