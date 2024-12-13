import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterActionnaireCommand } from './importer/importerActionnaire.command';
import {
  ConsulterActionnaireDependencies,
  registerConsulterActionnaireQuery,
} from './consulter/consulterActionnaire.query';
import { registerModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import { registerModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { registerDemanderModificationActionnaireUseCase } from './demanderModification/demandeModification.usecase';
import { registerDemanderModificationActionnaireCommand } from './demanderModification/demandeModification.command';
import { registerModificationActionnaireQuery } from './consulterModification/consulterModificationActionnaire.query';

export type ActionnaireQueryDependencies = ConsulterActionnaireDependencies;

export type ActionnaireCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerActionnaireUseCases = ({ loadAggregate }: ActionnaireCommandDependencies) => {
  registerImporterActionnaireCommand(loadAggregate);
  registerModifierActionnaireCommand(loadAggregate);
  registerDemanderModificationActionnaireCommand(loadAggregate);

  registerModifierActionnaireUseCase();
  registerDemanderModificationActionnaireUseCase();
};

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerConsulterActionnaireQuery(dependencies);
  registerModificationActionnaireQuery(dependencies);
};
