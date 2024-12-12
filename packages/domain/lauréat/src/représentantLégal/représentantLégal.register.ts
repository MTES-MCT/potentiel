import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';
import {
  ConsulterReprésentantLégalDependencies,
  registerConsulterRepresentantLegalQuery,
} from './consulter/consulterReprésentantLégal.query';
import { registerModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command';
import { registerModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
import { registerDemanderChangementReprésentantLégalUseCase } from './demandeChangement/demander/demanderChangementReprésentantLégal.usecase';
import { registerDemanderChangementReprésentantLégalCommand } from './demandeChangement/demander/demanderChangementReprésentantLégal.command';
import { registerConsulterDemandeChangementReprésentantLegalQuery } from './demandeChangement/consulter/consulterDemandeChangementReprésentantLégal.query';
import {
  ListerDemandeChangementReprésentantLégalDependencies,
  registerListerDemandeChangementReprésentantLégalQuery,
} from './demandeChangement/lister/listerDemandeChangementReprésentantLégal.query';

export type ReprésentantLégalQueryDependencies = ConsulterReprésentantLégalDependencies &
  ListerDemandeChangementReprésentantLégalDependencies;

export type ReprésentantLégalCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerReprésentantLégalUseCases = ({
  loadAggregate,
}: ReprésentantLégalCommandDependencies) => {
  // Commands
  registerImporterReprésentantLégalCommand(loadAggregate);
  registerModifierReprésentantLégalCommand(loadAggregate);
  registerDemanderChangementReprésentantLégalCommand(loadAggregate);

  // UseCases
  registerModifierReprésentantLégalUseCase();
  registerDemanderChangementReprésentantLégalUseCase();
};

export const registerReprésentantLégalQueries = (
  dependencies: ReprésentantLégalQueryDependencies,
) => {
  registerConsulterRepresentantLegalQuery(dependencies);
  registerConsulterDemandeChangementReprésentantLegalQuery(dependencies);
  registerListerDemandeChangementReprésentantLégalQuery(dependencies);
};
