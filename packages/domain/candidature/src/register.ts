import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import { registerImporterCandidatureCommand } from './importer/importerCandidature.command';
import { registerCorrigerCandidatureCommand } from './corriger/corrigerCandidature.command';
import { registerCorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import { registerNotifierCandidatureCommand } from './notifier/notifierCandidature.command';
import { registerNotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';

type CandiatureUseCasesDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerCandidaturesUseCases = ({ loadAggregate }: CandiatureUseCasesDependencies) => {
  registerImporterCandidatureCommand(loadAggregate);
  registerCorrigerCandidatureCommand(loadAggregate);
  registerNotifierCandidatureCommand(loadAggregate);

  registerImporterCandidatureUseCase();
  registerCorrigerCandidatureUseCase();
  registerNotifierCandidatureUseCase();
};
