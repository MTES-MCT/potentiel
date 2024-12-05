import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterActionnaireCommand } from './importerActionnaire/importerActionnaire.command';

export type ActionnaireCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerActionnaireUseCases = ({ loadAggregate }: ActionnaireCommandDependencies) => {
  registerImporterActionnaireCommand(loadAggregate);
};
