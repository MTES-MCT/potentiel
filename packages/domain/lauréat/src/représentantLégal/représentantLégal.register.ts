import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';
import {
  ConsulterReprésentantLégalDependencies,
  registerConsulterRepresentantLegalQuery,
} from './consulter/consulterReprésentantLégal.query';
import { registerCorrigerReprésentantLégalUseCase } from './corriger/corrigerReprésentantLégal.usecase';

export type ReprésentantLégalQueryDependencies = ConsulterReprésentantLégalDependencies;

export type ReprésentantLégalCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerReprésentantLégalUseCases = ({
  loadAggregate,
}: ReprésentantLégalCommandDependencies) => {
  // Commands
  registerImporterReprésentantLégalCommand(loadAggregate);

  // UseCases
  registerCorrigerReprésentantLégalUseCase();
};

export const registerReprésentantLégalQueries = (
  dependencies: ReprésentantLégalQueryDependencies,
) => {
  registerConsulterRepresentantLegalQuery(dependencies);
};
