import { LoadAggregate } from '@potentiel-domain/core';

import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import {
  ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import { registerImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import { registerImporterCandidatureCommand } from './importer/importerCandidature.command';
import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import { registerCorrigerCandidatureCommand } from './corriger/corrigerCandidature.command';
import { registerCorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import {
  ListerCandidaturesQueryDependencies,
  registerListerCandidaturesQuery,
} from './lister/listerCandidatures.query';
import { registerNotifierCandidatureCommand } from './notifier/notifierCandidature.command';
import { registerNotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';

type CandidatureQueryDependencies = ConsulterProjetDependencies &
  ListerProjetsEligiblesPreuveRecanditureDependencies &
  ConsulterCandidatureDependencies &
  ListerCandidaturesQueryDependencies;

type CandiatureUseCasesDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterProjetQuery(dependencies);
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
  registerConsulterCandidatureQuery(dependencies);
  registerListerCandidaturesQuery(dependencies);
};

export const registerCandidaturesUseCases = ({ loadAggregate }: CandiatureUseCasesDependencies) => {
  registerImporterCandidatureCommand(loadAggregate);
  registerCorrigerCandidatureCommand(loadAggregate);
  registerNotifierCandidatureCommand(loadAggregate);

  registerImporterCandidatureUseCase();
  registerCorrigerCandidatureUseCase();
  registerNotifierCandidatureUseCase();
};
